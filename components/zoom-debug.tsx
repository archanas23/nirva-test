import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ZoomService } from '../utils/zoom-service';

export function ZoomDebug() {
  const [isTesting, setIsTesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testZoomMeeting = async () => {
    setIsTesting(true);
    setError(null);
    setResult(null);

    try {
      console.log('🧪 Testing Zoom meeting creation...');
      
      const meeting = await ZoomService.createClassMeeting(
        'Test Class',
        'Test Teacher',
        '2025-09-08',
        '9:00 AM',
        60
      );

      console.log('🧪 Zoom meeting result:', meeting);
      setResult(meeting);

      if (meeting?.zoomMeeting?.join_url) {
        console.log('✅ Zoom link created successfully:', meeting.zoomMeeting.join_url);
      } else {
        console.log('❌ No Zoom link in result');
      }

    } catch (err) {
      console.error('❌ Zoom test failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Zoom Meeting Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testZoomMeeting}
          disabled={isTesting}
          className="w-full"
        >
          {isTesting ? 'Testing...' : 'Test Zoom Meeting Creation'}
        </Button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {result && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">
              <strong>Success!</strong> Meeting created
            </p>
            <div className="mt-2 text-xs">
              <p><strong>Meeting ID:</strong> {result.zoomMeeting?.meeting_id || 'N/A'}</p>
              <p><strong>Password:</strong> {result.zoomMeeting?.password || 'N/A'}</p>
              <p><strong>Join URL:</strong> {result.zoomMeeting?.join_url || 'N/A'}</p>
            </div>
            {result.zoomMeeting?.join_url && (
              <Button 
                size="sm" 
                className="mt-2"
                onClick={() => window.open(result.zoomMeeting.join_url, '_blank')}
              >
                Test Join Link
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
