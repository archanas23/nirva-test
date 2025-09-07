import { Resend } from 'resend'

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY)

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

export class EmailService {
  private static readonly ADMIN_EMAIL = 'nirvayogastudio@gmail.com'
  private static readonly FROM_EMAIL = 'noreply@nirva-yoga.com'

  static async sendBookingNotification(data: ClassBookingNotification): Promise<void> {
    try {
      // Send notification to admin
      await resend.emails.send({
        from: this.FROM_EMAIL,
        to: this.ADMIN_EMAIL,
        subject: `New Class Booking - ${data.className}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2D3748;">New Class Booking</h2>
            <div style="background: #F7FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Student:</strong> ${data.studentName}</p>
              <p><strong>Email:</strong> ${data.studentEmail}</p>
              <p><strong>Class:</strong> ${data.className}</p>
              <p><strong>Teacher:</strong> ${data.teacher}</p>
              <p><strong>Date:</strong> ${data.date}</p>
              <p><strong>Time:</strong> ${data.time}</p>
              ${data.zoomLink ? `<p><strong>Zoom Link:</strong> <a href="${data.zoomLink}">Join Class</a></p>` : ''}
            </div>
            <p style="color: #718096;">This booking was made through your Nirva Yoga Studio website.</p>
          </div>
        `
      })

      console.log('✅ Booking notification sent to admin')
    } catch (error) {
      console.error('❌ Failed to send booking notification:', error)
    }
  }

  static async sendStudentConfirmation(data: ClassBookingNotification): Promise<void> {
    try {
      // Send confirmation to student
      await resend.emails.send({
        from: this.FROM_EMAIL,
        to: data.studentEmail,
        subject: `Class Booking Confirmed - ${data.className}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2D3748;">Your Class is Booked! 🧘‍♀️</h2>
            <p>Hi ${data.studentName},</p>
            <p>Your class booking has been confirmed. We're excited to see you in class!</p>
            
            <div style="background: #F7FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2D3748; margin-top: 0;">Class Details</h3>
              <p><strong>Class:</strong> ${data.className}</p>
              <p><strong>Teacher:</strong> ${data.teacher}</p>
              <p><strong>Date:</strong> ${data.date}</p>
              <p><strong>Time:</strong> ${data.time}</p>
              ${data.zoomLink ? `
                <p><strong>Zoom Link:</strong> <a href="${data.zoomLink}" style="color: #3182CE;">Join Class</a></p>
                <p style="font-size: 14px; color: #718096;">Click the link above to join your class at the scheduled time.</p>
              ` : ''}
            </div>
            
            <p>If you have any questions, feel free to reach out to us at nirvayogastudio@gmail.com</p>
            <p>We look forward to practicing with you!</p>
            <p style="color: #718096;">Best regards,<br>The Nirva Yoga Team</p>
          </div>
        `
      })

      console.log('✅ Student confirmation sent')
    } catch (error) {
      console.error('❌ Failed to send student confirmation:', error)
    }
  }

  static async sendPackagePurchaseNotification(data: PackagePurchaseNotification): Promise<void> {
    try {
      // Send notification to admin
      await resend.emails.send({
        from: this.FROM_EMAIL,
        to: this.ADMIN_EMAIL,
        subject: `New Package Purchase - ${data.packageType} classes`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2D3748;">New Package Purchase</h2>
            <div style="background: #F7FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Student:</strong> ${data.studentName}</p>
              <p><strong>Email:</strong> ${data.studentEmail}</p>
              <p><strong>Package:</strong> ${data.packageType} classes</p>
              <p><strong>Price:</strong> $${data.packagePrice}</p>
              <p><strong>Classes Added:</strong> ${data.classesAdded}</p>
              <p><strong>Total Classes:</strong> ${data.totalClasses}</p>
            </div>
            <p style="color: #718096;">This package was purchased through your Nirva Yoga Studio website.</p>
          </div>
        `
      })

      console.log('✅ Package purchase notification sent to admin')
    } catch (error) {
      console.error('❌ Failed to send package purchase notification:', error)
    }
  }

  static async sendPackagePurchaseConfirmation(data: PackagePurchaseNotification): Promise<void> {
    try {
      // Send confirmation to student
      await resend.emails.send({
        from: this.FROM_EMAIL,
        to: data.studentEmail,
        subject: `Package Purchase Confirmed - ${data.packageType} classes`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2D3748;">Your Package is Ready! 🎉</h2>
            <p>Hi ${data.studentName},</p>
            <p>Your ${data.packageType}-class package has been purchased successfully!</p>
            
            <div style="background: #F7FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2D3748; margin-top: 0;">Package Details</h3>
              <p><strong>Package:</strong> ${data.packageType} classes</p>
              <p><strong>Price:</strong> $${data.packagePrice}</p>
              <p><strong>Classes Available:</strong> ${data.totalClasses}</p>
            </div>
            
            <p>You can now book classes using your package credits! Simply select a class and choose to pay with your package.</p>
            <p>If you have any questions, feel free to reach out to us at nirvayogastudio@gmail.com</p>
            <p>We look forward to practicing with you!</p>
            <p style="color: #718096;">Best regards,<br>The Nirva Yoga Team</p>
          </div>
        `
      })

      console.log('✅ Package purchase confirmation sent to student')
    } catch (error) {
      console.error('❌ Failed to send package purchase confirmation:', error)
    }
  }
}
