// Email service now uses Netlify functions to avoid CORS issues

export interface ClassBookingNotification {
  studentName: string
  studentEmail: string
  className: string
  teacher: string
  date: string
  time: string
  zoomMeetingId?: string
  zoomPassword?: string
  zoomLink?: string
}

export interface PackagePurchaseNotification {
  studentName: string
  studentEmail: string
  packageType: 'five' | 'ten'
  packagePrice: number
  classesAdded: number
  totalClasses: number
}

export interface WelcomeEmailData {
  studentName: string
  studentEmail: string
}

export class EmailService {
  private static readonly ADMIN_EMAIL = 'nirvayogastudio@gmail.com'
  private static readonly FROM_EMAIL = 'noreply@nirva-yoga.com'

  static async sendBookingNotification(data: ClassBookingNotification): Promise<void> {
    try {
      console.log('📧 Sending booking notification via Netlify function...')
      
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'booking-notification',
          data: data
        })
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('✅ Booking notification sent to admin')
        console.log('📧 Response:', result)
      } else {
        console.error('❌ Failed to send booking notification:', result.error)
      }
    } catch (error) {
      console.error('❌ Failed to send booking notification:', error)
    }
  }

  static async sendStudentConfirmation(data: ClassBookingNotification): Promise<void> {
    try {
      console.log('📧 Sending student confirmation via Netlify function...')
      
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'student-confirmation',
          data: data
        })
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('✅ Student confirmation sent')
        console.log('📧 Response:', result)
      } else {
        console.error('❌ Failed to send student confirmation:', result.error)
      }
    } catch (error) {
      console.error('❌ Failed to send student confirmation:', error)
    }
  }

  static async sendPackagePurchaseNotification(data: PackagePurchaseNotification): Promise<void> {
    try {
      console.log('📧 Sending package purchase notification via Netlify function...')
      
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'package-purchase',
          data: data
        })
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('✅ Package purchase notification sent to admin')
        console.log('📧 Response:', result)
      } else {
        console.error('❌ Failed to send package purchase notification:', result.error)
      }
    } catch (error) {
      console.error('❌ Failed to send package purchase notification:', error)
    }
  }

  static async sendPackagePurchaseConfirmation(data: PackagePurchaseNotification): Promise<void> {
    try {
      console.log('📧 Sending package purchase confirmation via Netlify function...')
      
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'package-purchase-confirmation',
          data: data
        })
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('✅ Package purchase confirmation sent to student')
        console.log('📧 Response:', result)
      } else {
        console.error('❌ Failed to send package purchase confirmation:', result.error)
      }
    } catch (error) {
      console.error('❌ Failed to send package purchase confirmation:', error)
    }
  }

  static async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    try {
      console.log('📧 Sending welcome email via Netlify function...')
      
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'welcome-email',
          data: data
        })
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('✅ Welcome email sent to new student')
        console.log('📧 Response:', result)
      } else {
        console.error('❌ Failed to send welcome email:', result.error)
      }
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error)
    }
  }

  // Generic email sending method
  static async sendEmail({ type, data }: { type: string, data: any }): Promise<void> {
    try {
      console.log(`📧 Sending ${type} email via Netlify function...`)
      
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: type,
          data: data
        })
      })

      const result = await response.json()
      
      if (result.success) {
        console.log(`✅ ${type} email sent successfully`)
        console.log('📧 Response:', result)
      } else {
        console.error(`❌ Failed to send ${type} email:`, result.error)
      }
    } catch (error) {
      console.error(`❌ Failed to send ${type} email:`, error)
    }
  }
}
