import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DatabaseService } from "../utils/database";

export function DatabaseTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testDatabase = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('🧪 Testing database operations...');
      
      // Test 1: Create/Update User
      console.log('🧪 Test 1: Creating user...');
      const userRecord = await DatabaseService.createOrUpdateUser({
        email: 'test@example.com',
        name: 'Test User'
      });
      console.log('✅ User created:', userRecord);
      
      // Test 2: Update User Credits
      console.log('🧪 Test 2: Updating user credits...');
      await DatabaseService.updateUserCredits(userRecord.id, {
        single_classes: 1,
        five_pack_classes: 0,
        ten_pack_classes: 0
      });
      console.log('✅ Credits updated');
      
      // Test 3: Book a Class
      console.log('🧪 Test 3: Booking a class...');
      await DatabaseService.bookClass(userRecord.id, {
        class_name: 'Test Yoga Class',
        teacher: 'Test Teacher',
        class_date: '2025-09-08',
        class_time: '6:00 pm',
        zoom_meeting_id: 'test-123',
        zoom_password: 'test123',
        zoom_link: 'https://zoom.us/j/test123'
      });
      console.log('✅ Class booked');
      
      // Test 4: Get User Credits
      console.log('🧪 Test 4: Getting user credits...');
      const credits = await DatabaseService.getUserCredits(userRecord.id);
      console.log('✅ Credits retrieved:', credits);
      
      // Test 5: Get User Booked Classes
      console.log('🧪 Test 5: Getting user booked classes...');
      const bookedClasses = await DatabaseService.getUserBookedClasses(userRecord.id);
      console.log('✅ Booked classes retrieved:', bookedClasses);
      
      setResult({
        success: true,
        userRecord,
        credits,
        bookedClasses
      });
      
    } catch (error) {
      console.error('🧪 Database Test Error:', error);
      setResult({ 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>🧪 Database Operations Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testDatabase} 
          disabled={loading}
          className="w-full"
        >
          {loading ? "Testing..." : "Test Database Operations"}
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
