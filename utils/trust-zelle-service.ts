// Trust-based Zelle payment service
export interface ZellePayment {
  id: string;
  studentName: string;
  studentEmail: string;
  amount: number;
  confirmationNumber: string;
  status: 'pending' | 'processed' | 'failed';
  createdAt: Date;
  processedAt?: Date;
  classDetails?: any;
  packageDetails?: any;
}

export class TrustZelleService {
  private static payments: Map<string, ZellePayment> = new Map();

  // Create payment request
  static createPaymentRequest(data: {
    studentName: string;
    studentEmail: string;
    amount: number;
    classDetails?: any;
    packageDetails?: any;
  }): ZellePayment {
    const payment: ZellePayment = {
      id: this.generatePaymentId(),
      studentName: data.studentName,
      studentEmail: data.studentEmail,
      amount: data.amount,
      confirmationNumber: this.generateConfirmationNumber(),
      status: 'pending',
      createdAt: new Date(),
      classDetails: data.classDetails,
      packageDetails: data.packageDetails
    };

    this.payments.set(payment.id, payment);
    
    // Send payment instructions to student
    this.sendPaymentInstructions(payment);
    
    return payment;
  }

  // Process payment (trust-based)
  static processPayment(paymentId: string): boolean {
    const payment = this.payments.get(paymentId);
    if (!payment) return false;

    payment.status = 'processed';
    payment.processedAt = new Date();
    this.payments.set(paymentId, payment);

    // Send confirmation email to student
    this.sendConfirmationEmail(payment);
    
    // Process the booking
    this.processBooking(payment);
    
    // Notify admin
    this.notifyAdmin(payment);
    
    return true;
  }

  // Get payment by ID
  static getPayment(id: string): ZellePayment | null {
    return this.payments.get(id) || null;
  }

  // Get all payments (for admin)
  static getAllPayments(): ZellePayment[] {
    return Array.from(this.payments.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  private static generatePaymentId(): string {
    return 'zelle_' + Math.random().toString(36).substring(2, 15);
  }

  private static generateConfirmationNumber(): string {
    return 'NY' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private static async sendPaymentInstructions(payment: ZellePayment): Promise<void> {
    const emailData = {
      to: payment.studentEmail,
      subject: 'Zelle Payment Instructions - Nirva Yoga',
      html: `
        <h2>Zelle Payment Instructions</h2>
        <p>Hi ${payment.studentName},</p>
        <p>Please send your Zelle payment to complete your booking:</p>
        
        <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <h3 style="color: #0c4a6e; margin: 0 0 8px 0;">Zelle Payment Details</h3>
          <p style="margin: 4px 0;"><strong>Send to:</strong> (805) 807-4894</p>
          <p style="margin: 4px 0;"><strong>Amount:</strong> $${payment.amount}</p>
          <p style="margin: 4px 0;"><strong>Memo:</strong> ${payment.confirmationNumber}</p>
        </div>
        
        <p>After sending payment, your booking will be automatically processed within 24 hours.</p>
        
        <p>Confirmation Number: ${payment.confirmationNumber}</p>
      `
    };

    console.log('Payment instructions email:', emailData);
  }

  private static async sendConfirmationEmail(payment: ZellePayment): Promise<void> {
    const emailData = {
      to: payment.studentEmail,
      subject: 'Payment Confirmed - Your Yoga Class is Booked!',
      html: `
        <h2>Payment Confirmed! 🎉</h2>
        <p>Hi ${payment.studentName},</p>
        <p>Your Zelle payment has been received and your yoga class is confirmed!</p>
        
        ${payment.classDetails ? `
          <h3>Class Details:</h3>
          <p><strong>Class:</strong> ${payment.classDetails.className}</p>
          <p><strong>Teacher:</strong> ${payment.classDetails.teacher}</p>
          <p><strong>Date:</strong> ${payment.classDetails.date}</p>
          <p><strong>Time:</strong> ${payment.classDetails.time}</p>
          <p><strong>Zoom Link:</strong> Will be sent 30 minutes before class</p>
        ` : ''}
        
        ${payment.packageDetails ? `
          <h3>Package Details:</h3>
          <p><strong>Package:</strong> ${payment.packageDetails.packageName}</p>
          <p><strong>Classes Added:</strong> ${payment.packageDetails.packageType === 'five' ? '5' : '10'}</p>
          <p>You can now book classes using your package credits!</p>
        ` : ''}
        
        <p>Confirmation Number: ${payment.confirmationNumber}</p>
        <p>Thank you for choosing Nirva Yoga!</p>
      `
    };

    console.log('Confirmation email:', emailData);
  }

  private static async notifyAdmin(payment: ZellePayment): Promise<void> {
    const emailData = {
      to: 'admin@nirvayoga.com',
      subject: `New Booking Confirmed - ${payment.studentName}`,
      html: `
        <h2>New Booking Confirmed</h2>
        <p><strong>Student:</strong> ${payment.studentName}</p>
        <p><strong>Email:</strong> ${payment.studentEmail}</p>
        <p><strong>Amount:</strong> $${payment.amount}</p>
        <p><strong>Confirmation Number:</strong> ${payment.confirmationNumber}</p>
        <p><strong>Processed:</strong> ${payment.processedAt?.toLocaleString()}</p>
        
        ${payment.classDetails ? `
          <h3>Class Details:</h3>
          <p><strong>Class:</strong> ${payment.classDetails.className}</p>
          <p><strong>Teacher:</strong> ${payment.classDetails.teacher}</p>
          <p><strong>Date:</strong> ${payment.classDetails.date}</p>
          <p><strong>Time:</strong> ${payment.classDetails.time}</p>
        ` : ''}
        
        ${payment.packageDetails ? `
          <h3>Package Details:</h3>
          <p><strong>Package:</strong> ${payment.packageDetails.packageName}</p>
          <p><strong>Type:</strong> ${payment.packageDetails.packageType}</p>
        ` : ''}
      `
    };

    console.log('Admin notification:', emailData);
  }

  private static async processBooking(payment: ZellePayment): Promise<void> {
    // Process the actual booking
    if (payment.classDetails) {
      // Book single class
      console.log('Processing single class booking:', payment.classDetails);
    } else if (payment.packageDetails) {
      // Process package purchase
      console.log('Processing package purchase:', payment.packageDetails);
    }
  }
}
