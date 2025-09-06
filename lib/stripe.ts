// Stripe configuration for production payments
// This file should be created when you're ready to implement real payments

import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
}

// Price IDs - replace with your actual Stripe Price IDs
export const STRIPE_PRICES = {
  SINGLE_CLASS: 'price_single_class_id_from_stripe',
  FIVE_PACK: 'price_five_pack_id_from_stripe', 
  TEN_PACK: 'price_ten_pack_id_from_stripe'
}

// Product configurations
export const PACKAGES = {
  single: {
    priceId: STRIPE_PRICES.SINGLE_CLASS,
    amount: 1000, // $10.00 in cents
    name: 'Single Class',
    description: 'One virtual yoga class'
  },
  five: {
    priceId: STRIPE_PRICES.FIVE_PACK,
    amount: 4800, // $48.00 in cents  
    name: '5-Class Package',
    description: '5 virtual yoga classes - Save $2!'
  },
  ten: {
    priceId: STRIPE_PRICES.TEN_PACK,
    amount: 9500, // $95.00 in cents
    name: '10-Class Package', 
    description: '10 virtual yoga classes - Save $5!'
  }
}

export type PackageType = keyof typeof PACKAGES