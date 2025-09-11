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
    const { className, teacher, date, time, duration = 60, meetingType = 'scheduled' } = JSON.parse(event.body);
    
    // Creating Zoom meeting

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
      duration,
      meetingType
    });

    // Zoom meeting created successfully

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
    // Log error for debugging but don't expose details to client
    
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
    // Getting Zoom access token

    if (!process.env.VITE_ZOOM_ACCOUNT_ID || !process.env.VITE_ZOOM_CLIENT_ID || !process.env.VITE_ZOOM_CLIENT_SECRET) {
      throw new Error('Missing Zoom API credentials. Please check environment variables.');
    }

    const credentials = Buffer.from(`${process.env.VITE_ZOOM_CLIENT_ID}:${process.env.VITE_ZOOM_CLIENT_SECRET}`).toString('base64');
    
    const response = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=account_credentials&account_id=${process.env.VITE_ZOOM_ACCOUNT_ID}`
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Zoom API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    // Zoom access token obtained successfully
    return data.access_token;
  } catch (error) {
    // Failed to get Zoom access token
    throw error;
  }
}

async function createZoomMeeting(accessToken, { className, teacher, date, time, duration, meetingType = 'scheduled' }) {
  try {
    // Creating Zoom meeting
    
    // For instant meetings, we don't need to parse date/time
    let startTime = null;
    if (meetingType !== 'instant') {
      // Parse date and time to create start time
      // Handle both YYYY-MM-DD and MM/DD/YYYY formats
      let year, month, day;
      if (date.includes('-')) {
        // YYYY-MM-DD format
        [year, month, day] = date.split('-');
      } else {
        // MM/DD/YYYY format
        [month, day, year] = date.split('/');
      }
      
      // Parse time - handle formats like "6:00 pm" or "6:00 PM"
      const timeMatch = time.match(/(\d+):(\d+)\s*(am|pm)/i);
      if (!timeMatch) {
        throw new Error(`Invalid time format: ${time}`);
      }
      
      const [, hours, minutes, ampm] = timeMatch;
      let hour24 = parseInt(hours);
      if (ampm.toLowerCase() === 'pm' && hour24 !== 12) hour24 += 12;
      if (ampm.toLowerCase() === 'am' && hour24 === 12) hour24 = 0;
      
      startTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hour24, parseInt(minutes));
      // Parsed start time
    }
    
    const meetingData = {
      topic: `${className} with ${teacher}`,
      type: meetingType === 'instant' ? 1 : 2, // Instant meeting (1) or Scheduled meeting (2)
      start_time: meetingType === 'instant' ? undefined : startTime.toISOString(),
      duration: duration,
      timezone: meetingType === 'instant' ? undefined : 'America/Los_Angeles',
      agenda: `Yoga class: ${className}`,
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: true,
        mute_upon_entry: false,
        watermark: false,
        use_pmi: false,
        audio: 'both',
        auto_recording: 'none',
        enforce_login: false,
        alternative_hosts: '',
        show_share_button: true,
        allow_multiple_devices: true,
        waiting_room: false,
        request_permission_to_unmute_participants: false,
        global_dial_in_countries: ['US'],
        meeting_authentication: false
      }
    };

    // Sending meeting data to Zoom API

    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(meetingData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Zoom API error: ${response.status} - ${errorText}`);
    }

    const meeting = await response.json();
    // Zoom meeting created successfully
    
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
    // Failed to create Zoom meeting
    throw error;
  }
}
