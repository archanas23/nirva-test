const { Resend } = require('resend');

const resend = new Resend(process.env.VITE_RESEND_API_KEY);

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
    console.log('📧 Netlify function called with:', event.body);
    const { type, data } = JSON.parse(event.body);
    console.log('📧 Email type:', type);
    console.log('📧 Email data:', data);

    let emailData;
    let result;

    switch (type) {
      case 'booking-notification':
        emailData = {
          from: 'noreply@nirva-yoga.com',
          to: 'nirvayogastudio@gmail.com',
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
        };
        break;

      case 'student-confirmation':
        emailData = {
          from: 'noreply@nirva-yoga.com',
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
        };
        break;

      case 'package-purchase':
        emailData = {
          from: 'noreply@nirva-yoga.com',
          to: 'nirvayogastudio@gmail.com',
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
        };
        break;

      case 'package-purchase-confirmation':
        emailData = {
          from: 'noreply@nirva-yoga.com',
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
        };
        break;

      case 'class-cancellation':
        emailData = {
          from: 'noreply@nirva-yoga.com',
          to: data.studentEmail,
          subject: `Class Cancelled - ${data.className}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2D3748;">Class Cancelled ✅</h2>
              <p>Hi ${data.studentName},</p>
              <p>Your class has been successfully cancelled and your credit has been restored.</p>
              
              <div style="background: #F7FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #2D3748; margin-top: 0;">Cancelled Class Details</h3>
                <p><strong>Class:</strong> ${data.className}</p>
                <p><strong>Teacher:</strong> ${data.teacher}</p>
                <p><strong>Date:</strong> ${data.date}</p>
                <p><strong>Time:</strong> ${data.time}</p>
                <p style="color: #38A169; font-weight: bold;">✅ 1 class credit has been restored to your account</p>
              </div>
              
              <p>You can now book any available class using your restored credit.</p>
              <p>If you have any questions, feel free to reach out to us at nirvayogastudio@gmail.com</p>
              <p style="color: #718096;">Best regards,<br>The Nirva Yoga Team</p>
            </div>
          `
        };
        break;

      case 'registration-inquiry':
        emailData = {
          from: 'noreply@nirva-yoga.com',
          to: 'nirvayogastudio@gmail.com',
          subject: `New Registration Inquiry - ${data.firstName} ${data.lastName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2D3748;">New Registration Inquiry 🧘‍♀️</h2>
              <div style="background: #F7FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Interest Level:</strong> ${data.interestLevel || 'Not specified'}</p>
                <p><strong>Yoga Goals:</strong></p>
                <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #3182CE;">
                  <p style="margin: 0; white-space: pre-wrap;">${data.yogaGoals || 'No specific goals mentioned'}</p>
                </div>
              </div>
              
              <div style="background: #E6FFFA; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #2D3748; margin-top: 0;">Next Steps</h3>
                <p style="margin: 0;">Please follow up with this potential student to:</p>
                <ul style="margin: 10px 0 0 20px;">
                  <li>Send class schedule and pricing information</li>
                  <li>Answer any questions they may have</li>
                  <li>Guide them through the registration process</li>
                </ul>
              </div>
              
              <p style="color: #718096;">This inquiry was submitted through your Nirva Yoga Studio registration form.</p>
            </div>
          `
        };
        break;

      default:
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ error: 'Invalid email type' }),
        };
    }

    console.log('📧 Sending email with data:', emailData);
    result = await resend.emails.send(emailData);
    console.log('📧 Resend response:', result);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        result: result
      }),
    };

  } catch (error) {
    console.error('Email sending error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
    };
  }
};
