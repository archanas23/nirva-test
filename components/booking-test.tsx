import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function BookingTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testBooking = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('🧪 Testing booking process...');
      
      // Simulate a class item
      const classItem = {
        id: 'test-class-123',
        className: 'Test Yoga Class',
        teacher: 'Test Teacher',
        time: '6:00 pm'
      };
      
      const day = '2025-09-08';
      
      // Test Zoom meeting creation
      console.log('🎥 Testing Zoom meeting creation...');
      const response = await fetch('/.netlify/functions/create-zoom-meeting-fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          className: classItem.className,
          teacher: classItem.teacher,
          date: day,
          time: classItem.time,
          duration: 60
        })
      });

      const zoomData = await response.json();
      console.log('🎥 Zoom API Response:', zoomData);
      
      setResult({
        classItem,
        day,
        zoomData
      });
      
    } catch (error) {
      console.error('🧪 Booking Test Error:', error);
      setResult({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>🧪 Booking Process Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testBooking} 
          disabled={loading}
          className="w-full"
        >
          {loading ? "Testing..." : "Test Booking Process"}
        </Button>
        
        {result && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Result:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
