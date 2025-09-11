const { Resend } = require('resend');

const resend = new Resend(process.env.VITE_RESEND_API_KEY);

// Simple in-memory rate limiting (in production, use Redis or database)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per 15 minutes per IP

function checkRateLimit(ip) {
  const now = Date.now();
  const key = ip;
  
  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  const data = rateLimitMap.get(key);
  
  if (now > data.resetTime) {
    // Reset the counter
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (data.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  data.count++;
  return true;
}

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://nirva-yoga.com',
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
        'Access-Control-Allow-Origin': 'https://nirva-yoga.com',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Rate limiting check
  const clientIP = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
  if (!checkRateLimit(clientIP)) {
    return {
      statusCode: 429,
      headers: {
        'Access-Control-Allow-Origin': 'https://nirva-yoga.com',
        'Retry-After': '900', // 15 minutes
      },
      body: JSON.stringify({ 
        error: 'Too many requests. Please try again later.',
        retryAfter: 900
      }),
    };
  }

  try {
    // Input validation and sanitization
    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': 'https://nirva-yoga.com',
        },
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    let requestData;
    try {
      requestData = JSON.parse(event.body);
    } catch (parseError) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': 'https://nirva-yoga.com',
        },
        body: JSON.stringify({ error: 'Invalid JSON in request body' }),
      };
    }

    const { type, data } = requestData;

    // Validate required fields
    if (!type || !data) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': 'https://nirva-yoga.com',
        },
        body: JSON.stringify({ error: 'Type and data are required' }),
      };
    }

    // Sanitize email addresses
    const sanitizeEmail = (email) => {
      if (!email || typeof email !== 'string') return null;
      return email.toLowerCase().trim().replace(/[<>]/g, '');
    };

    // Sanitize text inputs
    const sanitizeText = (text) => {
      if (!text || typeof text !== 'string') return '';
      return text.trim().replace(/[<>]/g, '').substring(0, 1000); // Limit length
    };

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
                  <div style="background: #E6FFFA; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #38B2AC;">
                    <h4 style="color: #2D3748; margin-top: 0; margin-bottom: 10px;">🔗 Zoom Meeting Details</h4>
                    <p style="margin: 5px 0;"><strong>Meeting ID:</strong> ${data.zoomMeetingId || 'N/A'}</p>
                    <p style="margin: 5px 0;"><strong>Password:</strong> ${data.zoomPassword || 'N/A'}</p>
                    <p style="margin: 10px 0 5px 0;"><strong>Join Link:</strong></p>
                    <a href="${data.zoomLink}" style="background: #38B2AC; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Join Zoom Meeting</a>
                    <p style="font-size: 14px; color: #718096; margin: 10px 0 0 0;">Click the button above to join your class at the scheduled time.</p>
                  </div>
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
          from: 'Nirva Yoga Studio <noreply@nirva-yoga.com>',
          to: data.email,
          subject: `Welcome to Nirva Yoga - Your Journey Begins Here 🧘‍♀️`,
          html: `
            <div style="font-family: 'Lora', 'Times New Roman', serif; max-width: 600px; margin: 0 auto; background: #fefffe;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #ff6b9d 0%, #fef7f0 50%, #fff0f5 100%); padding: 40px 20px; text-align: center; color: #2d3748; border-radius: 12px 12px 0 0;">
                <!-- Logo -->
                <div style="margin-bottom: 20px;">
                  <div style="width: 80px; height: 80px; margin: 0 auto; background: linear-gradient(135deg, #ff6b9d 0%, #fef7f0 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);">
                    <span style="font-family: 'Amatic SC', cursive; font-size: 32px; font-weight: bold; color: #2d3748; text-align: center; line-height: 1;">N</span>
                  </div>
                </div>
                <h1 style="margin: 0; font-size: 32px; font-weight: 400; font-family: 'Amatic SC', cursive; color: #2d3748;">Welcome to Nirva Yoga</h1>
                <p style="margin: 10px 0 0 0; font-size: 18px; color: #718096; font-style: italic;">Where Your Inner Peace Meets Your Outer Strength</p>
              </div>
              
              <!-- Quote Section -->
              <div style="padding: 30px 20px; text-align: center; background: #faf5f0;">
                <blockquote style="margin: 0; font-style: italic; font-size: 18px; color: #2d3748; line-height: 1.6; font-family: 'Lora', serif;">
                  "Yoga is not about touching your toes. It's about what you learn on the way down."
                </blockquote>
                <p style="margin: 10px 0 0 0; color: #718096; font-size: 14px; font-family: 'Lora', serif;">— Jigar Gor</p>
              </div>

              <!-- Main Content -->
              <div style="padding: 40px 20px; background: #fefffe;">
                <p style="font-size: 16px; line-height: 1.6; color: #2d3748; margin-bottom: 20px; font-family: 'Lora', serif;">
                  Dear <strong>${data.firstName}</strong>,
                </p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #2d3748; margin-bottom: 20px; font-family: 'Lora', serif;">
                  Welcome to the Nirva Yoga family! We're thrilled to have you join our community of mindful practitioners. Your journey to inner peace, strength, and wellness begins now.
                </p>

                <p style="font-size: 16px; line-height: 1.6; color: #2d3748; margin-bottom: 20px; font-family: 'Lora', serif;">
                  At Nirva Yoga, we believe that yoga is more than just physical exercise—it's a path to self-discovery, healing, and transformation. Whether you're a beginner or an experienced practitioner, our classes are designed to meet you where you are and guide you toward your goals.
                </p>

                <p style="font-size: 16px; line-height: 1.6; color: #2d3748; margin-bottom: 30px; font-family: 'Lora', serif;">
                  We promise to provide you with a safe, supportive, and inspiring environment where you can grow, learn, and connect with your inner self. Your wellness journey is our commitment.
                </p>
              
                <!-- What's Next Section -->
                <div style="background: #fef7f0; padding: 25px; border-radius: 8px; margin: 30px 0; border: 1px solid rgba(255, 107, 157, 0.15);">
                  <h2 style="color: #2d3748; margin-top: 0; font-size: 20px; font-family: 'Amatic SC', cursive;">What's Next?</h2>
                
                  <div style="margin: 20px 0;">
                    <div style="display: flex; align-items: center; margin: 15px 0;">
                      <span style="font-size: 24px; margin-right: 15px;">📧</span>
                      <div>
                        <h3 style="margin: 0; color: #2d3748; font-size: 16px; font-family: 'Lora', serif;">Email Confirmation</h3>
                        <p style="margin: 5px 0 0 0; color: #718096; font-size: 14px; font-family: 'Lora', serif;">You'll receive class schedules and booking instructions.</p>
                      </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; margin: 15px 0;">
                      <span style="font-size: 24px; margin-right: 15px;">📞</span>
                      <div>
                        <h3 style="margin: 0; color: #2d3748; font-size: 16px; font-family: 'Lora', serif;">Introductory Call</h3>
                        <p style="margin: 5px 0 0 0; color: #718096; font-size: 14px; font-family: 'Lora', serif;">Talk to instructor for 10 mins about your yoga needs.</p>
                      </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; margin: 15px 0;">
                      <span style="font-size: 24px; margin-right: 15px;">🧘‍♀️</span>
                      <div>
                        <h3 style="margin: 0; color: #2d3748; font-size: 16px; font-family: 'Lora', serif;">Book Your First Class</h3>
                        <p style="margin: 5px 0 0 0; color: #718096; font-size: 14px; font-family: 'Lora', serif;">Choose from our weekly schedule.</p>
                      </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; margin: 15px 0;">
                      <span style="font-size: 24px; margin-right: 15px;">💻</span>
                      <div>
                        <h3 style="margin: 0; color: #2d3748; font-size: 16px; font-family: 'Lora', serif;">Join via Zoom</h3>
                        <p style="margin: 5px 0 0 0; color: #718096; font-size: 14px; font-family: 'Lora', serif;">Receive meeting links 24 hours before class.</p>
                      </div>
                    </div>
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
        
        // Payment confirmation email sent
        break;

      case 'contact-inquiry':
        const sanitizedContactData = {
          firstName: sanitizeText(data.firstName),
          lastName: sanitizeText(data.lastName),
          email: sanitizeEmail(data.email),
          subject: sanitizeText(data.subject),
          message: sanitizeText(data.message)
        };

        if (!sanitizedContactData.email || !sanitizedContactData.firstName) {
          return {
            statusCode: 400,
            headers: {
              'Access-Control-Allow-Origin': 'https://nirva-yoga.com',
            },
            body: JSON.stringify({ error: 'Valid name and email are required' }),
          };
        }

        emailData = {
          from: 'noreply@nirva-yoga.com',
          to: 'nirvayogastudio@gmail.com',
          subject: `Contact Inquiry - ${sanitizedContactData.subject || 'General Question'}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2D3748;">New Contact Inquiry 📧</h2>
              <div style="background: #F7FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${sanitizedContactData.firstName} ${sanitizedContactData.lastName}</p>
                <p><strong>Email:</strong> ${sanitizedContactData.email}</p>
                <p><strong>Subject:</strong> ${sanitizedContactData.subject || 'No subject provided'}</p>
                <p><strong>Message:</strong></p>
                <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #3182CE;">
                  <p style="margin: 0; white-space: pre-wrap;">${sanitizedContactData.message || 'No message provided'}</p>
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

      case 'welcome-email':
        emailData = {
          from: 'Nirva Yoga Studio <noreply@nirva-yoga.com>',
          to: data.studentEmail,
          subject: 'Welcome to Nirva Yoga - Your Journey Begins Here 🧘‍♀️',
          html: `
            <div style="font-family: 'Lora', 'Times New Roman', serif; max-width: 600px; margin: 0 auto; background: #fefffe;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #ff6b9d 0%, #fef7f0 50%, #fff0f5 100%); padding: 40px 20px; text-align: center; color: #2d3748; border-radius: 12px 12px 0 0;">
                <!-- Logo -->
                <div style="margin-bottom: 20px;">
                  <div style="width: 80px; height: 80px; margin: 0 auto; background: linear-gradient(135deg, #ff6b9d 0%, #fef7f0 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);">
                    <span style="font-family: 'Amatic SC', cursive; font-size: 32px; font-weight: bold; color: #2d3748; text-align: center; line-height: 1;">N</span>
                  </div>
                </div>
                <h1 style="margin: 0; font-size: 32px; font-weight: 400; font-family: 'Amatic SC', cursive; color: #2d3748;">Welcome to Nirva Yoga</h1>
                <p style="margin: 10px 0 0 0; font-size: 18px; color: #718096; font-style: italic;">Where Your Inner Peace Meets Your Outer Strength</p>
              </div>

              <!-- Quote Section -->
              <div style="padding: 30px 20px; text-align: center; background: #faf5f0;">
                <blockquote style="margin: 0; font-style: italic; font-size: 18px; color: #2d3748; line-height: 1.6; font-family: 'Lora', serif;">
                  "Yoga is not about touching your toes. It's about what you learn on the way down."
                </blockquote>
                <p style="margin: 10px 0 0 0; color: #718096; font-size: 14px; font-family: 'Lora', serif;">— Jigar Gor</p>
              </div>

              <!-- Main Content -->
              <div style="padding: 40px 20px; background: #fefffe;">
                <p style="font-size: 16px; line-height: 1.6; color: #2d3748; margin-bottom: 20px; font-family: 'Lora', serif;">
                  Dear <strong>${data.studentName}</strong>,
                </p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #2d3748; margin-bottom: 20px; font-family: 'Lora', serif;">
                  Welcome to the Nirva Yoga family! We're thrilled to have you join our community of mindful practitioners. Your journey to inner peace, strength, and wellness begins now.
                </p>

                <p style="font-size: 16px; line-height: 1.6; color: #2d3748; margin-bottom: 20px; font-family: 'Lora', serif;">
                  At Nirva Yoga, we believe that yoga is more than just physical exercise—it's a path to self-discovery, healing, and transformation. Whether you're a beginner or an experienced practitioner, our classes are designed to meet you where you are and guide you toward your goals.
                </p>

                <p style="font-size: 16px; line-height: 1.6; color: #2d3748; margin-bottom: 30px; font-family: 'Lora', serif;">
                  We promise to provide you with a safe, supportive, and inspiring environment where you can grow, learn, and connect with your inner self. Your wellness journey is our commitment.
                </p>

                <!-- What's Next Section -->
                <div style="background: #fef7f0; padding: 25px; border-radius: 8px; margin: 30px 0; border: 1px solid rgba(255, 107, 157, 0.15);">
                  <h2 style="color: #2d3748; margin-top: 0; font-size: 20px; font-family: 'Amatic SC', cursive;">What's Next?</h2>
                  
                  <div style="margin: 20px 0;">
                    <div style="display: flex; align-items: center; margin: 15px 0;">
                      <span style="font-size: 24px; margin-right: 15px;">📧</span>
                      <div>
                        <strong style="color: #2D3748;">Email Confirmation</strong><br>
                        <span style="color: #718096; font-size: 14px;">You'll receive class schedules and booking instructions.</span>
                      </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; margin: 15px 0;">
                      <span style="font-size: 24px; margin-right: 15px;">📞</span>
                      <div>
                        <strong style="color: #2D3748;">Introductory Call</strong><br>
                        <span style="color: #718096; font-size: 14px;">Talk to instructor for 10 mins about your yoga needs.</span>
                      </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; margin: 15px 0;">
                      <span style="font-size: 24px; margin-right: 15px;">🧘‍♀️</span>
                      <div>
                        <strong style="color: #2D3748;">Book Your First Class</strong><br>
                        <span style="color: #718096; font-size: 14px;">Choose from our weekly schedule.</span>
                      </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; margin: 15px 0;">
                      <span style="font-size: 24px; margin-right: 15px;">💻</span>
                      <div>
                        <strong style="color: #2D3748;">Join via Zoom</strong><br>
                        <span style="color: #718096; font-size: 14px;">Receive meeting links 24 hours before class.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- This Week's Classes -->
                <div style="background: #fff0f5; padding: 25px; border-radius: 8px; margin: 30px 0; border: 1px solid rgba(255, 107, 157, 0.15);">
                  <h3 style="color: #2d3748; margin-top: 0; font-size: 18px; font-family: 'Amatic SC', cursive;">This Week's Classes</h3>
                  <p style="color: #2d3748; margin: 10px 0; font-weight: 500; font-family: 'Lora', serif;">Morning Flow • Evening Restore • Weekend Flow</p>
                  <p style="color: #718096; margin: 5px 0; font-size: 14px; font-family: 'Lora', serif;">All Levels • 60 minutes • Experienced Teachers</p>
                  <div style="margin-top: 15px;">
                    <a href="https://nirva-yoga.com/classes" style="background: #ff6b9d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block; font-family: 'Lora', serif;">View Full Schedule</a>
                  </div>
                </div>

                <!-- Contact Info -->
                <div style="background: #f0f4f8; padding: 25px; border-radius: 8px; margin: 30px 0;">
                  <h3 style="color: #2D3748; margin-top: 0; font-size: 18px;">We're Here for You</h3>
                  <p style="color: #2D3748; margin: 10px 0;"><strong>Email:</strong> nirvayogastudio@gmail.com</p>
                  <p style="color: #2D3748; margin: 10px 0;"><strong>Website:</strong> nirva-yoga.com</p>
                  <p style="color: #718096; margin: 15px 0 0 0; font-size: 14px;">Questions? We're always here to help guide your journey.</p>
                </div>

                <!-- Footer -->
                <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
                  <h3 style="color: #2D3748; margin: 0 0 10px 0; font-size: 20px;">Welcome to Your New Beginning</h3>
                  <p style="color: #718096; margin: 0; font-size: 14px;">The Nirva Yoga Team</p>
                </div>
              </div>
            </div>
          `
        };
        break;

      case 'password-reset':
        emailData = {
          from: 'Nirva Yoga Studio <noreply@nirva-yoga.com>',
          to: data.studentEmail,
          subject: 'Reset Your Nirva Yoga Password 🔐',
          html: `
            <div style="font-family: 'Lora', 'Times New Roman', serif; max-width: 600px; margin: 0 auto; background: #fefffe;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #ff6b9d 0%, #fef7f0 50%, #fff0f5 100%); padding: 40px 20px; text-align: center; color: #2d3748; border-radius: 12px 12px 0 0;">
                <!-- Logo -->
                <div style="margin-bottom: 20px;">
                  <div style="width: 80px; height: 80px; margin: 0 auto; background: linear-gradient(135deg, #ff6b9d 0%, #fef7f0 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);">
                    <span style="font-family: 'Amatic SC', cursive; font-size: 32px; font-weight: bold; color: #2d3748; text-align: center; line-height: 1;">N</span>
                  </div>
                </div>
                <h1 style="margin: 0; font-size: 32px; font-weight: 400; font-family: 'Amatic SC', cursive; color: #2d3748;">Nirva Yoga Studio</h1>
                <p style="margin: 10px 0 0 0; font-size: 18px; color: #718096; font-style: italic;">Password Reset</p>
              </div>

              <!-- Main Content -->
              <div style="padding: 40px 20px; background: #fefffe;">
                <p style="font-size: 16px; line-height: 1.6; color: #2d3748; margin-bottom: 20px; font-family: 'Lora', serif;">
                  Dear <strong>${data.studentName}</strong>,
                </p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #2d3748; margin-bottom: 20px; font-family: 'Lora', serif;">
                  We received a request to reset your password for your Nirva Yoga account. If you made this request, click the button below to reset your password.
                </p>

                <!-- Reset Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://nirva-yoga.com/?token=${data.resetToken}&email=${data.studentEmail}" 
                     style="background: #ff6b9d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 500; display: inline-block; font-family: 'Lora', serif; font-size: 16px;">
                    Reset My Password
                  </a>
                </div>

                <p style="font-size: 14px; line-height: 1.6; color: #718096; margin-bottom: 20px; font-family: 'Lora', serif;">
                  If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="font-size: 12px; line-height: 1.4; color: #718096; margin-bottom: 20px; font-family: 'Lora', serif; word-break: break-all; background: #faf5f0; padding: 10px; border-radius: 4px;">
                  https://nirva-yoga.com/?token=${data.resetToken}&email=${data.studentEmail}
                </p>

                <div style="background: #fef7f0; padding: 20px; border-radius: 8px; margin: 30px 0; border: 1px solid rgba(255, 107, 157, 0.15);">
                  <h3 style="color: #2d3748; margin-top: 0; font-size: 16px; font-family: 'Amatic SC', cursive;">Important Security Notes:</h3>
                  <ul style="color: #2d3748; font-size: 14px; line-height: 1.6; font-family: 'Lora', serif; margin: 10px 0; padding-left: 20px;">
                    <li>This link will expire in 24 hours for security</li>
                    <li>If you didn't request this reset, please ignore this email</li>
                    <li>Your password will remain unchanged until you click the link</li>
                  </ul>
                </div>

                <p style="font-size: 14px; line-height: 1.6; color: #718096; margin-bottom: 0; font-family: 'Lora', serif;">
                  If you're having trouble, please contact us at nirvayogastudio@gmail.com
                </p>
              </div>

              <!-- Footer -->
              <div style="text-align: center; margin-top: 20px; padding: 20px; background: #faf5f0; border-radius: 0 0 12px 12px;">
                <p style="color: #718096; margin: 0; font-size: 14px; font-family: 'Lora', serif;">The Nirva Yoga Team</p>
                <p style="color: #718096; margin: 5px 0 0 0; font-size: 12px; font-family: 'Lora', serif;">Find your inner peace through mindful movement</p>
              </div>
            </div>
          `
        };
        break;

      default:
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': 'https://nirva-yoga.com',
          },
          body: JSON.stringify({ error: 'Invalid email type' }),
        };
    }

    // Sending email via Resend
    result = await resend.emails.send(emailData);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://nirva-yoga.com',
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        result: result
      }),
    };

  } catch (error) {
    // Email sending error
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://nirva-yoga.com',
      },
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
    };
  }
};
