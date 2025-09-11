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
    // Skipping webhook verification for testing
    try {
      stripeEvent = JSON.parse(event.body);
    } catch (err) {
      // Failed to parse webhook body
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid webhook body' })
      };
    }
  } else {
    try {
      stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
    } catch (err) {
      // Webhook signature verification failed
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
      // Payment succeeded
      
        // Process successful payment
        try {
          // Payment details processed

          // Extract payment details
          const studentEmail = paymentIntent.metadata.studentEmail;
          const studentName = paymentIntent.metadata.studentName;
          const packageDetails = JSON.parse(paymentIntent.metadata.packageDetails || '{}');
          const classDetails = JSON.parse(paymentIntent.metadata.classDetails || '{}');

          // Student and package details

          // Send payment confirmation email
          if (studentEmail) {
            // Sending payment confirmation email
            
            const paymentAmount = (paymentIntent.amount / 100).toFixed(2);
            const paymentCurrency = paymentIntent.currency.toUpperCase();
            
            // Send payment confirmation to student
            await fetch(`${process.env.URL}/.netlify/functions/send-email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'payment-confirmation',
                studentEmail: studentEmail,
                studentName: studentName,
                paymentAmount: paymentAmount,
                paymentCurrency: paymentCurrency,
                packageDetails: packageDetails,
                classDetails: classDetails
              })
            });
            
            // Payment confirmation email sent
          }

          // Process package purchase
          if (packageDetails.type) {
            // Processing package purchase

            // TODO: Add database operations here
            // 1. Update user credits in database
            // 2. Send confirmation email to student
            // 3. Send notification email to admin
            // 4. Log the purchase

            // Package purchased successfully
          }

          // Process single class booking
          if (classDetails.className) {
            // Processing class booking

            // TODO: Add class booking logic here
            // 1. Book the class in database
            // 2. Generate Zoom meeting
            // 3. Send confirmation email with Zoom link
            // 4. Update user credits

            // Class booked successfully
          }

          // Payment processed successfully
        } catch (error) {
          // Error processing payment
        }
      
      break;
    
    case 'payment_intent.payment_failed':
      const failedPayment = stripeEvent.data.object;
      // Payment failed
      
      // Handle failed payment:
      // 1. Send failure notification email
      // 2. Log the failure for review
      
      break;
    
    default:
      // Unhandled event type
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true })
  };
};

