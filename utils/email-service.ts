// Email service for sending notifications to admin

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

  static async sendBookingNotification(data: ClassBookingNotification): Promise<void> {
    console.log('Mock: Sending booking notification to admin:', data)
    // Real email will work once Resend is properly configured
  }

  static async sendStudentConfirmation(data: ClassBookingNotification): Promise<void> {
    console.log('Mock: Sending confirmation to student:', data)
    // Real email will work once Resend is properly configured
  }

  static async sendPackagePurchaseNotification(data: PackagePurchaseNotification): Promise<void> {
    console.log('Mock: Sending package purchase notification to admin:', data)
    // Real email will work once Resend is properly configured
  }

  static async sendPackagePurchaseConfirmation(data: PackagePurchaseNotification): Promise<void> {
    console.log('Mock: Sending package purchase confirmation to student:', data)
    // Real email will work once Resend is properly configured
  }
}
