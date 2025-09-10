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
        // Send admin notification
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

        case 'registration-confirmation':
        // Send student confirmation with beautiful welcome package
        emailData = {
          from: 'noreply@nirva-yoga.com',
          to: data.email,
          subject: `Welcome to Nirva Yoga - Your Journey Begins Here 🧘‍♀️`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #f8f4f0 0%, #e8d5c4 100%);">
              
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #8B4513; font-size: 28px; margin-bottom: 10px; font-family: 'Georgia', serif;">Welcome to Nirva Yoga</h1>
                <p style="color: #666; font-size: 16px; margin: 0;">Where Your Inner Peace Meets Your Outer Strength</p>
              </div>
              
              <!-- Yoga Quote -->
              <div style="background: white; padding: 25px; border-radius: 15px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <blockquote style="font-style: italic; font-size: 18px; color: #8B4513; text-align: center; margin: 0; line-height: 1.6;">
                  "Yoga is not about touching your toes. It's about what you learn on the way down."
                </blockquote>
                <p style="text-align: center; color: #666; margin: 10px 0 0 0; font-size: 14px;">— Jigar Gor</p>
              </div>
              
              <!-- Personal Message -->
              <div style="background: white; padding: 25px; border-radius: 15px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <h2 style="color: #8B4513; font-size: 22px; margin-bottom: 15px;">Dear ${data.firstName},</h2>
                <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
                  Welcome to the Nirva Yoga family! We're thrilled to have you join our community of mindful practitioners. 
                  Your journey to inner peace, strength, and wellness begins now.
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
                  At Nirva Yoga, we believe that yoga is more than just physical exercise—it's a path to self-discovery, 
                  healing, and transformation. Whether you're a beginner or an experienced practitioner, our classes are 
                  designed to meet you where you are and guide you toward your goals.
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0;">
                  We promise to provide you with a safe, supportive, and inspiring environment where you can grow, 
                  learn, and connect with your inner self. Your wellness journey is our commitment.
                </p>
              </div>
              
              <!-- What's Next -->
              <div style="background: white; padding: 25px; border-radius: 15px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <h3 style="color: #8B4513; font-size: 20px; margin-bottom: 20px; text-align: center;">What's Next?</h3>
                
                <div style="margin-bottom: 20px;">
                  <h4 style="color: #8B4513; font-size: 16px; margin-bottom: 8px;">📧 Email Confirmation</h4>
                  <p style="color: #333; font-size: 14px; margin: 0; line-height: 1.5;">
                    You'll receive class schedules and booking instructions.
                  </p>
                </div>
                
                <div style="margin-bottom: 20px;">
                  <h4 style="color: #8B4513; font-size: 16px; margin-bottom: 8px;">📞 Introductory Call</h4>
                  <p style="color: #333; font-size: 14px; margin: 0; line-height: 1.5;">
                    Talk to instructor for 10 mins about your yoga needs.
                  </p>
                </div>
                
                <div style="margin-bottom: 20px;">
                  <h4 style="color: #8B4513; font-size: 16px; margin-bottom: 8px;">🧘‍♀️ Book Your First Class</h4>
                  <p style="color: #333; font-size: 14px; margin: 0; line-height: 1.5;">
                    Choose from our weekly schedule.
                  </p>
                </div>
                
                <div>
                  <h4 style="color: #8B4513; font-size: 16px; margin-bottom: 8px;">💻 Join via Zoom</h4>
                  <p style="color: #333; font-size: 14px; margin: 0; line-height: 1.5;">
                    Receive meeting links 24 hours before class.
                  </p>
                </div>
              </div>
              
              <!-- Class Schedule Preview -->
              <div style="background: white; padding: 25px; border-radius: 15px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <h3 style="color: #8B4513; font-size: 20px; margin-bottom: 20px; text-align: center;">This Week's Classes</h3>
                <div style="text-align: center; margin-bottom: 15px;">
                  <p style="color: #666; font-size: 14px; margin: 0;">Morning Flow • Evening Restore • Weekend Flow</p>
                  <p style="color: #666; font-size: 14px; margin: 0;">All Levels • 60 minutes • Experienced Teachers</p>
                </div>
                <div style="text-align: center;">
                  <a href="https://nirva-yoga.com" style="background: #8B4513; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                    View Full Schedule
                  </a>
                </div>
              </div>
              
              <!-- Contact Info -->
              <div style="background: white; padding: 25px; border-radius: 15px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <h3 style="color: #8B4513; font-size: 20px; margin-bottom: 20px; text-align: center;">We're Here for You</h3>
                <div style="text-align: center;">
                  <p style="color: #333; font-size: 16px; margin-bottom: 10px;">
                    <strong>Email:</strong> nirvayogastudio@gmail.com
                  </p>
                  <p style="color: #333; font-size: 16px; margin-bottom: 10px;">
                    <strong>Website:</strong> nirva-yoga.com
                  </p>
                  <p style="color: #333; font-size: 16px; margin: 0;">
                    <strong>Questions?</strong> We're always here to help guide your journey.
                  </p>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #8B4513; font-size: 18px; margin-bottom: 10px; font-family: 'Georgia', serif;">
                  Welcome to Your New Beginning
                </p>
                <p style="color: #666; font-size: 14px; margin: 0;">
                  The Nirva Yoga Team
                </p>
              </div>
              
            </div>
          `
        };
        break;

      case 'payment-confirmation':
        const { studentName, paymentAmount, paymentCurrency, packageDetails, classDetails } = data;
        
        const paymentSubject = `Payment Received - Nirva Yoga Studio`;
        const paymentBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #f8f4f0 0%, #e8d5c4 100%);">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #8B4513; font-size: 28px; margin-bottom: 10px; font-family: 'Georgia', serif;">Payment Confirmation</h1>
              <p style="color: #666; font-size: 16px; margin: 0;">Thank you for your payment!</p>
            </div>
            
            <!-- Payment Details -->
            <div style="background: white; padding: 25px; border-radius: 15px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <h2 style="color: #8B4513; font-size: 22px; margin-bottom: 15px;">Dear ${studentName},</h2>
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
                We have successfully received your payment of <strong>${paymentCurrency} ${paymentAmount}</strong>.
              </p>
              
              ${packageDetails && packageDetails.type ? `
              <h3 style="color: #8B4513; font-size: 18px; margin-bottom: 10px;">Package Details:</h3>
              <ul style="color: #333; margin-bottom: 15px;">
                <li><strong>Package:</strong> ${packageDetails.name}</li>
                <li><strong>Price:</strong> ${paymentCurrency} ${paymentAmount}</li>
                <li><strong>Credits Added:</strong> ${packageDetails.credits || 'N/A'}</li>
              </ul>
              ` : ''}
              
              ${classDetails && classDetails.className ? `
              <h3 style="color: #8B4513; font-size: 18px; margin-bottom: 10px;">Class Details:</h3>
              <ul style="color: #333; margin-bottom: 15px;">
                <li><strong>Class:</strong> ${classDetails.className}</li>
                <li><strong>Teacher:</strong> ${classDetails.teacher}</li>
                <li><strong>Date:</strong> ${classDetails.date}</li>
                <li><strong>Time:</strong> ${classDetails.time}</li>
              </ul>
              ` : ''}
              
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Your class credits have been added to your account. You can now book classes or use your credits as needed.
              </p>
            </div>
            
            <!-- Next Steps -->
            <div style="background: white; padding: 25px; border-radius: 15px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <h3 style="color: #8B4513; font-size: 20px; margin-bottom: 15px; text-align: center;">What's Next?</h3>
              <div style="text-align: center;">
                <a href="https://nirva-yoga.com" style="background: #8B4513; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; margin-bottom: 15px;">
                  Book Your Classes
                </a>
              </div>
              <p style="color: #333; font-size: 14px; text-align: center; margin: 0;">
                Visit our website to view the schedule and book your classes.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #333; font-size: 16px; margin-bottom: 10px;">
                If you have any questions, feel free to reach out to us at nirvayogastudio@gmail.com
              </p>
              <p style="color: #8B4513; font-size: 18px; margin-bottom: 10px; font-family: 'Georgia', serif;">
                Thank You for Choosing Nirva Yoga
              </p>
              <p style="color: #666; font-size: 14px; margin: 0;">
                The Nirva Yoga Team
              </p>
            </div>
            
          </div>
        `;
        
        await resend.emails.send({
          from: 'Nirva Yoga Studio <noreply@nirva-yoga.com>',
          to: data.studentEmail,
          subject: paymentSubject,
          html: paymentBody
        });
        
        console.log('✅ Payment confirmation email sent to:', data.studentEmail);
        break;

      case 'contact-inquiry':
        emailData = {
          from: 'noreply@nirva-yoga.com',
          to: 'nirvayogastudio@gmail.com',
          subject: `Contact Inquiry - ${data.subject || 'General Question'}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2D3748;">New Contact Inquiry 📧</h2>
              <div style="background: #F7FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Subject:</strong> ${data.subject || 'No subject provided'}</p>
                <p><strong>Message:</strong></p>
                <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #3182CE;">
                  <p style="margin: 0; white-space: pre-wrap;">${data.message || 'No message provided'}</p>
                </div>
              </div>
              
              <div style="background: #FFF5F5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #2D3748; margin-top: 0;">Response Required</h3>
                <p style="margin: 0;">Please respond to this inquiry within 24 hours to maintain good customer service.</p>
              </div>
              
              <p style="color: #718096;">This inquiry was submitted through your Nirva Yoga Studio contact form.</p>
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
