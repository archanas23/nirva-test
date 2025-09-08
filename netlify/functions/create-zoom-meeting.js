const axios = require('axios');

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
    const { className, teacher, date, time, duration = 60 } = JSON.parse(event.body);
    
    console.log('🎥 Creating Zoom meeting for:', { className, teacher, date, time });

    // Get access token
    const accessToken = await getZoomAccessToken();
    if (!accessToken) {
      throw new Error('Failed to get Zoom access token');
    }

    // Create meeting
    const meeting = await createZoomMeeting(accessToken, {
      className,
      teacher,
      date,
      time,
      duration
    });

    console.log('✅ Zoom meeting created:', meeting);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        success: true, 
        meeting: meeting
      }),
    };

  } catch (error) {
    console.error('❌ Zoom meeting creation error:', error);
    
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

async function getZoomAccessToken() {
  try {
    console.log('🔑 Getting Zoom access token...');
    console.log('🔑 Account ID:', process.env.VITE_ZOOM_ACCOUNT_ID ? 'Set' : 'Missing');
    console.log('🔑 Client ID:', process.env.VITE_ZOOM_CLIENT_ID ? 'Set' : 'Missing');
    console.log('🔑 Client Secret:', process.env.VITE_ZOOM_CLIENT_SECRET ? 'Set' : 'Missing');

    if (!process.env.VITE_ZOOM_ACCOUNT_ID || !process.env.VITE_ZOOM_CLIENT_ID || !process.env.VITE_ZOOM_CLIENT_SECRET) {
      throw new Error('Missing Zoom API credentials. Please check environment variables.');
    }

    const response = await axios.post('https://zoom.us/oauth/token', 
      `grant_type=account_credentials&account_id=${process.env.VITE_ZOOM_ACCOUNT_ID}`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.VITE_ZOOM_CLIENT_ID}:${process.env.VITE_ZOOM_CLIENT_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    console.log('✅ Zoom access token obtained successfully');
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Failed to get Zoom access token:');
    console.error('Error details:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Headers:', error.response?.headers);
    throw error;
  }
}

async function createZoomMeeting(accessToken, { className, teacher, date, time, duration }) {
  try {
    console.log('🎥 Creating Zoom meeting with data:', { className, teacher, date, time, duration });
    
    // Parse date and time to create start time
    const [month, day, year] = date.split('/');
    const [hours, minutes] = time.split(':');
    const ampm = time.includes('AM') ? 'AM' : 'PM';
    
    let hour24 = parseInt(hours);
    if (ampm === 'PM' && hour24 !== 12) hour24 += 12;
    if (ampm === 'AM' && hour24 === 12) hour24 = 0;
    
    const startTime = new Date(year, month - 1, day, hour24, parseInt(minutes));
    console.log('🎥 Parsed start time:', startTime.toISOString());
    
    const meetingData = {
      topic: `${className} with ${teacher}`,
      type: 2, // Scheduled meeting
      start_time: startTime.toISOString(),
      duration: duration,
      timezone: 'America/Los_Angeles', // Adjust to your timezone
      agenda: `Yoga class: ${className}`,
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
        watermark: false,
        use_pmi: false,
        approval_type: 0, // Automatically approve
        audio: 'both',
        auto_recording: 'none',
        enforce_login: false,
        enforce_login_domains: '',
        alternative_hosts: '',
        close_registration: false,
        show_share_button: true,
        allow_multiple_devices: true,
        registrants_confirmation_email: false,
        waiting_room: false,
        request_permission_to_unmute_participants: false,
        global_dial_in_countries: ['US'],
        registrants_email_notification: false
      }
    };

    console.log('🎥 Meeting data to send:', JSON.stringify(meetingData, null, 2));

    const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', meetingData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const meeting = response.data;
    console.log('✅ Zoom meeting created successfully:', meeting);
    
    return {
      meeting_id: meeting.id.toString(),
      password: meeting.password || '',
      join_url: meeting.join_url,
      start_time: meeting.start_time,
      duration: meeting.duration,
      topic: meeting.topic,
      host_email: meeting.host_email
    };

  } catch (error) {
    console.error('❌ Failed to create Zoom meeting:');
    console.error('Error details:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Request data:', error.config?.data);
    throw error;
  }
}
