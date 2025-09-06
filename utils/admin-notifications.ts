// Admin notification system for class bookings
// In a real application, this would send emails via a backend API or service like EmailJS

interface ClassBooking {
  studentName: string;
  studentEmail: string;
  className: string;
  teacher: string;
  date: string;
  time: string;
  paymentMethod?: string;
  amount?: number;
  zoomLink?: string;
  meetingId?: string;
  passcode?: string;
}

export const sendAdminNotification = async (booking: ClassBooking) => {
  // Simulate admin email notification
  // In production, you would:
  // 1. Use EmailJS for direct client-side emails
  // 2. Send to a backend API that handles email notifications
  // 3. Use a service like Resend, SendGrid, or Nodemailer
  
  const adminEmail = "nirvayogastudio@gmail.com";
  const subject = `New Class Booking - ${booking.className}`;
  
  const emailContent = `
🧘‍♀️ NEW CLASS BOOKING ALERT 🧘‍♀️

A student has just booked a class!

📋 BOOKING DETAILS:
━━━━━━━━━━━━━━━━━━━━
👤 Student: ${booking.studentName}
📧 Email: ${booking.studentEmail}
🕉️ Class: ${booking.className}
👩‍🏫 Teacher: ${booking.teacher}
📅 Date: ${booking.date}
⏰ Time: ${booking.time}

💳 PAYMENT INFO:
━━━━━━━━━━━━━━━━━━━━
Payment Method: ${booking.paymentMethod || 'Zelle'}
Amount: ${booking.amount?.toFixed(2) || 'N/A'}
${booking.paymentMethod?.includes('Zelle') ? '⚠️ Please verify Zelle payment in your bank app!' : ''}

━━━━━━━━━━━━━━━━━━━━

This booking was made through nirvayogastudio.com

${booking.paymentMethod?.includes('Zelle') ? 'Next Steps:\n1. Check Zelle payments in your bank app\n2. Verify payment matches booking details\n3. Reply to confirm class is secured\n\n' : ''}Thank you for bringing peace and mindfulness to our community!

🙏 Namaste,
Nirva Yoga Booking System
  `;

  // Log to console for development (remove in production)
  console.log("📧 ADMIN NOTIFICATION:", {
    to: adminEmail,
    subject,
    content: emailContent
  });

  // Trigger notification display for admin
  const notificationEvent = new CustomEvent('classBooked', {
    detail: booking
  });
  window.dispatchEvent(notificationEvent);

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // In production, replace this with actual email service
  // Example with EmailJS:
  /*
  try {
    await emailjs.send(
      'your_service_id',
      'your_template_id',
      {
        to_email: adminEmail,
        subject: subject,
        student_name: booking.studentName,
        student_email: booking.studentEmail,
        class_name: booking.className,
        teacher: booking.teacher,
        date: booking.date,
        time: booking.time
      },
      'your_public_key'
    );
    return { success: true };
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    return { success: false, error };
  }
  */

  // For now, return success simulation
  return { success: true, message: "Admin notification sent successfully!" };
};

// Helper function to format booking confirmation for students
export const sendStudentConfirmation = async (booking: ClassBooking) => {
  const confirmationContent = `
🙏 CLASS BOOKING CONFIRMED 🙏

Dear ${booking.studentName},

Your Nirva Yoga class has been successfully booked!

📋 YOUR BOOKING:
━━━━━━━━━━━━━━━━━━━━
🕉️ Class: ${booking.className}
👩‍🏫 Teacher: ${booking.teacher}
📅 Date: ${booking.date}
⏰ Time: ${booking.time}

━━━━━━━━━━━━━━━━━━━━

🔗 ZOOM LINK: We'll send you the Zoom meeting link 1 hour before class starts.

📱 WHAT TO PREPARE:
• Yoga mat
• Water bottle
• Comfortable clothing
• Quiet space
• Stable internet connection

❓ Questions? Reply to this email or contact us at nirvayogastudio@gmail.com

We can't wait to practice with you! 

✨ Namaste,
The Nirva Yoga Team

Follow us @NirvaYogaStudio
  `;

  console.log("📧 STUDENT CONFIRMATION:", {
    to: booking.studentEmail,
    subject: `Class Confirmed - ${booking.className}`,
    content: confirmationContent
  });

  return { success: true, message: "Student confirmation sent successfully!" };
};