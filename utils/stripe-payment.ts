import { loadStripe, Stripe } from '@stripe/stripe-js';
import { DatabaseService } from './database';
import { EmailService } from './email-service';

let stripePromise: Promise<Stripe | null> | null = null

export interface StripePaymentData {
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  amount: number;
  classDetails?: any;
  packageDetails?: any;
}

export class StripePaymentService {
  private static stripe: Stripe | null = null;
  private static paymentDataCache: Map<string, StripePaymentData> = new Map();

  static async initialize(): Promise<Stripe | null> {
    if (!this.stripe) {
      const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
      if (!key) {
        console.error('Missing VITE_STRIPE_PUBLISHABLE_KEY')
        return null
      }
      if (!stripePromise) {
        stripePromise = loadStripe(key)
      }
      this.stripe = await stripePromise
    }
    return this.stripe
  }

  static async createPaymentIntent(data: StripePaymentData): Promise<string | null> {
    try {
      const response = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(data.amount * 100), // Convert to cents
          currency: 'usd',
          metadata: {
            studentName: data.studentName,
            studentEmail: data.studentEmail,
            studentPhone: data.studentPhone || '',
            classDetails: JSON.stringify(data.classDetails || {}),
            packageDetails: JSON.stringify(data.packageDetails || {}),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId } = await response.json();
      
      // Cache the payment data for later use
      if (paymentIntentId) {
        this.paymentDataCache.set(paymentIntentId, data);
      }
      
      return clientSecret;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      return null;
    }
  }

  static async processPayment(
    clientSecret: string,
    onSuccess: (paymentIntent: any) => void,
    onError: (error: string) => void
  ): Promise<void> {
    console.log('🚀 Starting processPayment with clientSecret:', clientSecret);
    
    try {
      console.log('🔧 Initializing Stripe...');
      const stripe = await this.initialize();
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }
      console.log('✅ Stripe initialized successfully');

      // For testing purposes, we'll simulate a successful payment
      // In production, you'd use Stripe Elements to collect card info
      console.log('Simulating successful payment for testing...');
      
      // Get the payment intent ID from the client secret
      const paymentIntentId = clientSecret.split('_secret_')[0];
      console.log('Payment intent ID:', paymentIntentId);
      
      // Get the cached payment data
      const paymentData = this.paymentDataCache.get(paymentIntentId);
      console.log('Cached payment data:', paymentData);
      
      // Create a mock successful payment intent with the actual data
      const mockPaymentIntent = {
        id: paymentIntentId,
        status: 'succeeded',
        amount: paymentData ? Math.round(paymentData.amount * 100) : 100,
        currency: 'usd',
        metadata: {
          studentName: paymentData?.studentName || 'Test User',
          studentEmail: paymentData?.studentEmail || 'test@example.com',
          studentPhone: paymentData?.studentPhone || '',
          classDetails: JSON.stringify(paymentData?.classDetails || {}),
          packageDetails: JSON.stringify(paymentData?.packageDetails || {})
        }
      };

      console.log('Mock payment intent created:', mockPaymentIntent);

      // Note: Database operations are handled in App.tsx onSuccess callback
      // This keeps the separation of concerns clean
      console.log('Payment processing complete, calling onSuccess...');
      
      onSuccess(mockPaymentIntent);
      console.log('✅ onSuccess callback called');
      
    } catch (error: any) {
      console.error('❌ Payment processing error:', error);
      console.error('❌ Error stack:', error.stack);
      onError(error.message || 'Payment processing failed');
    }
  }

  private static async handleSuccessfulPayment(paymentIntent: any) {
    try {
      const metadata = paymentIntent.metadata;
      const classDetails = JSON.parse(metadata.classDetails || '{}');
      const packageDetails = JSON.parse(metadata.packageDetails || '{}');

      if (classDetails.className) {
        // Handle class booking
        await DatabaseService.createBooking({
          student_name: metadata.studentName,
          student_email: metadata.studentEmail,
          class_name: classDetails.className,
          teacher: classDetails.teacher,
          class_date: classDetails.day,
          class_time: classDetails.time,
          payment_method: 'Credit Card',
          amount: metadata.amount / 100,
          zoom_meeting_id: classDetails.zoomMeetingId,
          zoom_password: classDetails.zoomPassword,
          zoom_link: classDetails.zoomLink
        });

        // Send notifications
        await EmailService.sendBookingNotification({
          studentName: metadata.studentName,
          studentEmail: metadata.studentEmail,
          className: classDetails.className,
          teacher: classDetails.teacher,
          date: classDetails.day,
          time: classDetails.time,
          zoomMeetingId: classDetails.zoomMeetingId,
          zoomPassword: classDetails.zoomPassword,
          zoomLink: classDetails.zoomLink
        });

        await EmailService.sendStudentConfirmation({
          studentName: metadata.studentName,
          studentEmail: metadata.studentEmail,
          className: classDetails.className,
          teacher: classDetails.teacher,
          date: classDetails.day,
          time: classDetails.time,
          zoomMeetingId: classDetails.zoomMeetingId,
          zoomPassword: classDetails.zoomPassword,
          zoomLink: classDetails.zoomLink
        });
      } else if (packageDetails.type) {
        // Handle package purchase
        await DatabaseService.createPackage({
          student_email: metadata.studentEmail,
          package_type: packageDetails.type,
          total_classes: packageDetails.type === 'five' ? 5 : 10,
          remaining_classes: packageDetails.type === 'five' ? 5 : 10
        });

        // Send notifications
        await EmailService.sendPackagePurchaseNotification({
          studentName: metadata.studentName,
          studentEmail: metadata.studentEmail,
          packageType: packageDetails.type,
          packagePrice: metadata.amount / 100,
          classesAdded: packageDetails.type === 'five' ? 5 : 10,
          totalClasses: packageDetails.type === 'five' ? 5 : 10
        });

        await EmailService.sendPackagePurchaseConfirmation({
          studentName: metadata.studentName,
          studentEmail: metadata.studentEmail,
          packageType: packageDetails.type,
          packagePrice: metadata.amount / 100,
          classesAdded: packageDetails.type === 'five' ? 5 : 10,
          totalClasses: packageDetails.type === 'five' ? 5 : 10
        });
      }
    } catch (error) {
      console.error('Error handling successful payment:', error);
    }
  }

  static async validatePayment(paymentIntentId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/validate-payment/${paymentIntentId}`);
      const { status } = await response.json();
      return status === 'succeeded';
    } catch (error) {
      console.error('Error validating payment:', error);
      return false;
    }
  }
}

// Test Cards for Stripe
const testCards = {
  // Successful payments
  visa: '4242424242424242',
  visaDebit: '4000056655665556',
  mastercard: '5555555555554444',
  amex: '378282246310005',
  discover: '6011111111111117',
  
  // Declined payments
  declined: '4000000000000002',
  insufficientFunds: '4000000000009995',
  expiredCard: '4000000000000069',
  
  // 3D Secure (requires authentication)
  requires3DS: '4000002500003155'
}
