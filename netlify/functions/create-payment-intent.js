const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Check if Stripe is properly initialized
    if (!stripe) {
      console.error('❌ Stripe not initialized - check STRIPE_SECRET_KEY');
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ 
          error: 'Stripe not initialized',
          details: 'STRIPE_SECRET_KEY environment variable is missing or invalid'
        }),
      };
    }

    const { amount, currency = 'usd', metadata } = JSON.parse(event.body);
    
    console.log('💳 Creating payment intent for amount:', amount);
    console.log('💳 Currency:', currency);
    console.log('💳 Metadata:', metadata);
    console.log('💳 Stripe initialized:', !!stripe);

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      metadata: metadata || {},
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('✅ Payment intent created:', paymentIntent.id);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }),
    };

  } catch (error) {
    console.error('❌ Error creating payment intent:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error name:', error.name);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Failed to create payment intent',
        details: error.message,
        type: error.name
      }),
    };
  }
};
