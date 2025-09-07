import React, { useState } from 'react'
import { EmailService } from '../utils/email-service'

export function ResendTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>('')

  const testBookingNotification = async () => {
    setIsLoading(true)
    setResult('')
    
    try {
      await EmailService.sendBookingNotification({
        studentName: 'Test Student',
        studentEmail: 'test@example.com',
        className: 'Test Yoga Class',
        teacher: 'Test Teacher',
        date: new Date().toLocaleDateString(),
        time: '10:00 AM',
        zoomLink: 'https://zoom.us/test'
      })
      setResult('✅ Booking notification sent successfully!')
    } catch (error) {
      setResult(`❌ Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testStudentConfirmation = async () => {
    setIsLoading(true)
    setResult('')
    
    try {
      await EmailService.sendStudentConfirmation({
        studentName: 'Test Student',
        studentEmail: 'test@example.com',
        className: 'Test Yoga Class',
        teacher: 'Test Teacher',
        date: new Date().toLocaleDateString(),
        time: '10:00 AM',
        zoomLink: 'https://zoom.us/test'
      })
      setResult('✅ Student confirmation sent successfully!')
    } catch (error) {
      setResult(`❌ Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testPackagePurchase = async () => {
    setIsLoading(true)
    setResult('')
    
    try {
      await EmailService.sendPackagePurchaseNotification({
        studentName: 'Test Student',
        studentEmail: 'test@example.com',
        packageType: '5-Class Package',
        packagePrice: 75,
        classesAdded: 5,
        totalClasses: 5
      })
      setResult('✅ Package purchase notification sent successfully!')
    } catch (error) {
      setResult(`❌ Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Resend Email Testing</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Test Booking Notification</h3>
          <p className="text-sm text-blue-600 mb-3">
            Sends email to admin when a class is booked
          </p>
          <button
            onClick={testBookingNotification}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Test Admin Notification'}
          </button>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Test Student Confirmation</h3>
          <p className="text-sm text-green-600 mb-3">
            Sends confirmation email to student
          </p>
          <button
            onClick={testStudentConfirmation}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Test Student Confirmation'}
          </button>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold text-purple-800 mb-2">Test Package Purchase</h3>
          <p className="text-sm text-purple-600 mb-3">
            Sends notification when a package is purchased
          </p>
          <button
            onClick={testPackagePurchase}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Test Package Purchase'}
          </button>
        </div>
      </div>

      {result && (
        <div className={`mt-6 p-4 rounded-lg ${
          result.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Make sure your Resend API key is set in the .env file</li>
          <li>• Verify your domain in Resend dashboard</li>
          <li>• Check your email (admin@nirvayogastudio.com) for test emails</li>
          <li>• Remove this component before going to production</li>
        </ul>
      </div>
    </div>
  )
}
