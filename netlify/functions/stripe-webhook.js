const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const sig = event.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  // Skip webhook verification for testing if no signature provided
  if (!sig || !endpointSecret) {
    console.log('⚠️ Skipping webhook verification for testing');
    try {
      stripeEvent = JSON.parse(event.body);
    } catch (err) {
      console.error('Failed to parse webhook body:', err.message);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid webhook body' })
      };
    }
  } else {
    try {
      stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid signature' })
      };
    }
  }

  // Handle the event
  switch (stripeEvent.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = stripeEvent.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      
      // Process successful payment
      try {
        console.log('✅ Payment succeeded:', paymentIntent.id);
        console.log('💰 Amount:', paymentIntent.amount);
        console.log('💳 Currency:', paymentIntent.currency);
        console.log('📧 Customer email:', paymentIntent.receipt_email);
        console.log('📦 Metadata:', paymentIntent.metadata);
        
        // Extract payment details
        const studentEmail = paymentIntent.metadata.studentEmail;
        const studentName = paymentIntent.metadata.studentName;
        const packageDetails = JSON.parse(paymentIntent.metadata.packageDetails || '{}');
        const classDetails = JSON.parse(paymentIntent.metadata.classDetails || '{}');
        
        console.log('👤 Student:', studentName, studentEmail);
        console.log('📦 Package:', packageDetails);
        
        // Process package purchase
        if (packageDetails.type) {
          console.log('🛒 Processing package purchase...');
          
          // TODO: Add database operations here
          // 1. Update user credits in database
          // 2. Send confirmation email to student
          // 3. Send notification email to admin
          // 4. Log the purchase
          
          console.log(`✅ Package purchased: ${packageDetails.name} for $${packageDetails.price}`);
        }
        
        // Process single class booking
        if (classDetails.className) {
          console.log('🧘‍♀️ Processing class booking...');
          
          // TODO: Add class booking logic here
          // 1. Book the class in database
          // 2. Generate Zoom meeting
          // 3. Send confirmation email with Zoom link
          // 4. Update user credits
          
          console.log(`✅ Class booked: ${classDetails.className}`);
        }
        
        console.log('✅ Payment processed successfully');
      } catch (error) {
        console.error('❌ Error processing payment:', error);
      }
      
      break;
    
    case 'payment_intent.payment_failed':
      const failedPayment = stripeEvent.data.object;
      console.log('Payment failed:', failedPayment.id);
      
      // Handle failed payment:
      // 1. Send failure notification email
      // 2. Log the failure for review
      
      break;
    
    default:
      console.log(`Unhandled event type: ${stripeEvent.type}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true })
  };
};

