import React, { useState } from 'react'
import { StripePaymentService } from '../utils/stripe-payment'

export function TestPayment() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const testPayment = async () => {
    setLoading(true)
    setResult('')

    try {
      // Test with a small amount
      const paymentData = {
        studentName: 'Test User',
        studentEmail: 'test@example.com',
        amount: 1.00, // $1.00 test payment
        classDetails: {
          className: 'Test Class',
          teacher: 'Test Teacher',
          day: 'Monday',
          time: '10:00 AM'
        }
      }

      const clientSecret = await StripePaymentService.createPaymentIntent(paymentData)
      
      if (clientSecret) {
        await StripePaymentService.processPayment(
          clientSecret,
          (paymentIntent) => {
            setResult(`✅ Payment successful! ID: ${paymentIntent.id}`)
          },
          (error) => {
            setResult(`❌ Payment failed: ${error}`)
          }
        )
      } else {
        setResult('❌ Failed to create payment intent')
      }
    } catch (error) {
      setResult(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Test Payment</h2>
      <button
        onClick={testPayment}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Test $1.00 Payment'}
      </button>
      {result && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          {result}
        </div>
      )}
    </div>
  )
}
