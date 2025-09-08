import React, { useState } from 'react'
import { ZoomService } from '../utils/zoom-service'

export function ZoomTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [meeting, setMeeting] = useState<any>(null)

  const testCreateMeeting = async () => {
    setIsLoading(true)
    setResult('')
    setMeeting(null)
    
    try {
      const meeting = await ZoomService.createMeeting(
        'Test Yoga Class',
        'Test Teacher',
        '12/25/2024', // MM/DD/YYYY format
        '10:00 AM',
        60 // 60 minutes
      )
      
      if (meeting) {
        setMeeting(meeting)
        setResult('✅ Zoom meeting created successfully!')
      } else {
        setResult('❌ Failed to create Zoom meeting')
      }
    } catch (error) {
      setResult(`❌ Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testCreateClassMeeting = async () => {
    setIsLoading(true)
    setResult('')
    setMeeting(null)
    
    try {
      const classMeeting = await ZoomService.createClassMeeting(
        'Test Yoga Class',
        'Test Teacher',
        '12/25/2024', // MM/DD/YYYY format
        '10:00 AM',
        60 // 60 minutes
      )
      
      if (classMeeting) {
        setMeeting(classMeeting.zoomMeeting)
        setResult('✅ Class meeting created successfully!')
      } else {
        setResult('❌ Failed to create class meeting')
      }
    } catch (error) {
      setResult(`❌ Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Zoom Meeting Testing</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Test Create Meeting</h3>
          <p className="text-sm text-blue-600 mb-3">
            Creates a basic Zoom meeting
          </p>
          <button
            onClick={testCreateMeeting}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Test Create Meeting'}
          </button>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Test Create Class Meeting</h3>
          <p className="text-sm text-green-600 mb-3">
            Creates a class meeting with full details
          </p>
          <button
            onClick={testCreateClassMeeting}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Test Create Class Meeting'}
          </button>
        </div>
      </div>

      {result && (
        <div className={`mt-6 p-4 rounded-lg ${
          result.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}

      {meeting && (
        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-3">🎥 Meeting Details:</h4>
          <div className="space-y-2 text-sm">
            <div><strong>Meeting ID:</strong> {meeting.meeting_id}</div>
            <div><strong>Password:</strong> {meeting.password || 'No password required'}</div>
            <div><strong>Join URL:</strong> 
              <a href={meeting.join_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                {meeting.join_url}
              </a>
            </div>
            <div><strong>Start Time:</strong> {new Date(meeting.start_time).toLocaleString()}</div>
            <div><strong>Duration:</strong> {meeting.duration} minutes</div>
            {meeting.topic && <div><strong>Topic:</strong> {meeting.topic}</div>}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Setup Required:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Get Zoom API credentials from <a href="https://marketplace.zoom.us/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Zoom Marketplace</a></li>
          <li>• Create a Server-to-Server OAuth App</li>
          <li>• Add environment variables to Netlify:</li>
          <li className="ml-4">- VITE_ZOOM_ACCOUNT_ID</li>
          <li className="ml-4">- VITE_ZOOM_CLIENT_ID</li>
          <li className="ml-4">- VITE_ZOOM_CLIENT_SECRET</li>
          <li>• Each class will get a unique Zoom meeting automatically</li>
        </ul>
      </div>
    </div>
  )
}
