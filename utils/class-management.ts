import { EmailService, ClassBookingNotification, PackagePurchaseNotification } from './email-service';
import { ZoomService, ClassMeeting } from './zoom-service';

export interface ClassBooking {
  id: string;
  studentName: string;
  studentEmail: string;
  className: string;
  teacher: string;
  date: string;
  time: string;
  timestamp: Date;
  paymentMethod: string;
  amount: number;
  zoomMeetingId?: string;   
  zoomPassword?: string;
  zoomLink?: string;
}

export class ClassManagementService {
  private static meetings: Map<string, ClassMeeting> = new Map();
  
  // Book a class with email notifications and Zoom integration
  static async bookClass(bookingData: {
    studentName: string;
    studentEmail: string;
    className: string;
    teacher: string;
    date: string;
    time: string;
    paymentMethod: string;
    amount: number;
  }): Promise<ClassBooking | null> {
    try {
      // Generate unique booking ID
      const bookingId = this.generateBookingId();
      
      // Get or create Zoom meeting for this class
      const meeting = await this.getOrCreateClassMeeting(
        bookingData.className,
        bookingData.teacher,
        bookingData.date,
        bookingData.time
      );
      
      // Create booking record
      const booking: ClassBooking = {
        id: bookingId,
        studentName: bookingData.studentName,
        studentEmail: bookingData.studentEmail,
        className: bookingData.className,
        teacher: bookingData.teacher,
        date: bookingData.date,
        time: bookingData.time,
        timestamp: new Date(),
        paymentMethod: bookingData.paymentMethod,
        amount: bookingData.amount,
        zoomMeetingId: meeting?.zoomMeeting.meeting_id,
        zoomPassword: meeting?.zoomMeeting.password,
        zoomLink: meeting?.zoomMeeting.join_url
      };
      
      // Send email notifications for class booking
      await this.sendBookingNotifications(booking);
      
      // Store booking (in production, save to database)
      this.storeBooking(booking);
      
      return booking;
    } catch (error) {
      console.error('Failed to book class:', error);
      return null;
    }
  }

  // Purchase a class package (no Zoom links generated)
  static async purchasePackage(purchaseData: {
    studentName: string;
    studentEmail: string;
    packageType: 'five' | 'ten';
    packagePrice: number;
    classesAdded: number;
    totalClasses: number;
  }): Promise<boolean> {
    try {
      const purchase: PackagePurchaseNotification = {
        studentName: purchaseData.studentName,
        studentEmail: purchaseData.studentEmail,
        packageType: purchaseData.packageType,
        packagePrice: purchaseData.packagePrice,
        classesAdded: purchaseData.classesAdded,
        totalClasses: purchaseData.totalClasses
      };

      // Send package purchase notifications (no Zoom links)
      await EmailService.sendPackagePurchaseNotification(purchase);
      await EmailService.sendPackagePurchaseConfirmation(purchase);
      
      // Store package purchase (in production, save to database)
      this.storePackagePurchase(purchase);
      
      return true;
    } catch (error) {
      console.error('Failed to process package purchase:', error);
      return false;
    }
  }
  
  // Get or create Zoom meeting for a class
  private static async getOrCreateClassMeeting(
    className: string,
    teacher: string,
    date: string,
    time: string
  ): Promise<ClassMeeting | null> {
    const meetingKey = `${className}-${teacher}-${date}-${time}`;
    
    // Check if meeting already exists
    if (this.meetings.has(meetingKey)) {
      return this.meetings.get(meetingKey)!;
    }
    
    // Create new meeting
    const meeting = await ZoomService.createClassMeeting(className, teacher, date, time);
    if (meeting) {
      this.meetings.set(meetingKey, meeting);
    }
    
    return meeting;
  }
  
  // Send email notifications for class booking (with Zoom links)
  private static async sendBookingNotifications(booking: ClassBooking): Promise<void> {
    const notificationData: ClassBookingNotification = {
      studentName: booking.studentName,
      studentEmail: booking.studentEmail,
      className: booking.className,
      teacher: booking.teacher,
      date: booking.date,
      time: booking.time,
      zoomMeetingId: booking.zoomMeetingId,
      zoomPassword: booking.zoomPassword,
      zoomLink: booking.zoomLink
    };
    
    // Send notification to admin
    await EmailService.sendBookingNotification(notificationData);
    
    // Send confirmation to student
    await EmailService.sendStudentConfirmation(notificationData);
  }
  
  // Store booking (in production, this would save to database)
  private static storeBooking(booking: ClassBooking): void {
    console.log('Storing booking:', booking);
  }

  // Store package purchase (in production, this would save to database)
  private static storePackagePurchase(purchase: PackagePurchaseNotification): void {
    console.log('Storing package purchase:', purchase);
  }
  
  // Get all bookings (for admin panel)
  static async getAllBookings(): Promise<ClassBooking[]> {
    // TODO: Implement database retrieval
    return [];
  }
  
  // Get bookings for a specific class
  static async getClassBookings(className: string, date: string): Promise<ClassBooking[]> {
    // TODO: Implement database query
    return [];
  }
  
  private static generateBookingId(): string {
    return 'booking_' + Math.random().toString(36).substring(2, 15);
  }
}
