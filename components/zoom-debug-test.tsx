import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function ZoomDebugTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testZoomAPI = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('🧪 Testing Zoom API directly...');
      
      const response = await fetch('/.netlify/functions/create-zoom-meeting-fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          className: "Test Class",
          teacher: "Test Teacher",
          date: "2025-09-08",
          time: "6:00 pm",
          duration: 60
        })
      });

      const data = await response.json();
      console.log('🧪 Zoom API Response:', data);
      setResult(data);
      
    } catch (error) {
      console.error('🧪 Zoom API Error:', error);
      setResult({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>🧪 Zoom API Debug Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testZoomAPI} 
          disabled={loading}
          className="w-full"
        >
          {loading ? "Testing..." : "Test Zoom API"}
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
