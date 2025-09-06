// Utility functions for generating unique Zoom meetings per class session

export interface ZoomMeeting {
  zoomLink: string;
  meetingId: string;
  passcode: string;
}

// Generate a unique Zoom meeting for each class session
export function generateUniqueZoomMeeting(classId: string, className: string, date: string): ZoomMeeting {
  // Create a seed based on class ID and date for consistent generation
  const seed = `${classId}-${date}`;
  
  // Generate a realistic Meeting ID based on the seed
  const hash = simpleHash(seed);
  const meetingId = (100000000 + (hash % 900000000)).toString();
  const formattedMeetingId = `${meetingId.slice(0,3)} ${meetingId.slice(3,6)} ${meetingId.slice(6,9)}`;
  
  // Generate a unique passcode
  const passcode = generatePasscode(className, classId);
  
  // Generate the Zoom link
  const zoomLink = `https://zoom.us/j/${meetingId}?pwd=${passcode.toLowerCase()}`;
  
  return {
    zoomLink,
    meetingId: formattedMeetingId,
    passcode
  };
}

// Simple hash function for generating consistent IDs
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Generate a passcode based on class name and ID
function generatePasscode(className: string, classId: string): string {
  // Extract first letters of class name
  const words = className.split(' ');
  const prefix = words.map(word => word.charAt(0).toUpperCase()).join('').slice(0, 3);
  
  // Add some numbers based on class ID
  const hash = simpleHash(classId);
  const numbers = (hash % 999).toString().padStart(3, '0');
  
  return `${prefix}${numbers}`;
}

// Get or generate Zoom meeting for a specific class session
export function getZoomMeetingForClass(classId: string, className: string, date: string, teacher: string): ZoomMeeting {
  // In a real application, you would:
  // 1. Check if a meeting already exists for this class session
  // 2. If not, generate a new one and store it
  // 3. Return the stored meeting details
  
  // For now, we'll generate consistently based on the input
  return generateUniqueZoomMeeting(classId, className, date);
}

// Validate Zoom meeting details
export function validateZoomMeeting(meeting: ZoomMeeting): boolean {
  return !!(
    meeting.zoomLink && 
    meeting.meetingId && 
    meeting.passcode &&
    meeting.zoomLink.includes('zoom.us') &&
    meeting.meetingId.length >= 9 &&
    meeting.passcode.length >= 3
  );
}

// Format meeting details for display
export function formatMeetingDetails(meeting: ZoomMeeting, className: string, date: string, time: string): string {
  return `
🧘‍♀️ ${className}
📅 ${date} at ${time}

💻 ZOOM MEETING DETAILS:
🔗 Link: ${meeting.zoomLink}
🆔 Meeting ID: ${meeting.meetingId}
🔐 Passcode: ${meeting.passcode}

⚡ QUICK ACCESS:
• Join 5-10 minutes early
• Have your yoga mat ready
• Ensure stable internet connection
`;
}