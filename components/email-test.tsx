import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Mail, Send, CheckCircle, XCircle, AlertTriangle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { EmailService } from '../utils/email-service';

export function EmailTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testName, setTestName] = useState('Test User');
  const [testMessage, setTestMessage] = useState('This is a test email from Nirva Yoga Studio admin panel.');

  const emailTypes = [
    { 
      id: 'registration-inquiry', 
      name: 'Registration Inquiry', 
      description: 'Test new student registration email',
      recipient: 'Admin (nirvayogastudio@gmail.com)'
    },
    { 
      id: 'registration-confirmation', 
      name: 'Registration Confirmation', 
      description: 'Test student welcome email',
      recipient: 'Student'
    },
    { 
      id: 'contact-inquiry', 
      name: 'Contact Inquiry', 
      description: 'Test general contact form email',
      recipient: 'Admin (nirvayogastudio@gmail.com)'
    },
    { 
      id: 'booking-notification', 
      name: 'Booking Notification', 
      description: 'Test class booking notification',
      recipient: 'Admin (nirvayogastudio@gmail.com)'
    },
    { 
      id: 'student-confirmation', 
      name: 'Student Confirmation', 
      description: 'Test student booking confirmation',
      recipient: 'Student'
    },
    { 
      id: 'package-purchase', 
      name: 'Package Purchase', 
      description: 'Test package purchase notification',
      recipient: 'Admin (nirvayogastudio@gmail.com)'
    },
    { 
      id: 'package-purchase-confirmation', 
      name: 'Package Purchase Confirmation', 
      description: 'Test package purchase confirmation',
      recipient: 'Student'
    },
    { 
      id: 'class-cancellation', 
      name: 'Class Cancellation', 
      description: 'Test class cancellation email',
      recipient: 'Student'
    }
  ];

  const addTestResult = (test: string, status: 'success' | 'error', message: string, details?: any) => {
    const result = {
      id: Date.now(),
      test,
      status,
      message,
      details,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
  };

  const testEmailType = async (emailType: string) => {
    setIsLoading(true);
    try {
      const emailTypeInfo = emailTypes.find(type => type.id === emailType);
      addTestResult(emailTypeInfo?.name || emailType, 'success', `Testing ${emailTypeInfo?.name}...`);

      let testData: any = {
        firstName: testName.split(' ')[0] || 'Test',
        lastName: testName.split(' ')[1] || 'User',
        email: testEmail
      };

      // Add specific data based on email type
      switch (emailType) {
        case 'registration-inquiry':
        case 'registration-confirmation':
          testData = {
            ...testData,
            interestLevel: 'Beginner',
            yogaGoals: testMessage
          };
          break;
        case 'contact-inquiry':
          testData = {
            ...testData,
            subject: 'Test Contact Inquiry',
            message: testMessage
          };
          break;
        case 'booking-notification':
        case 'student-confirmation':
          testData = {
            ...testData,
            className: 'Test Yoga Class',
            teacher: 'Test Teacher',
            date: new Date().toLocaleDateString(),
            time: '6:00 PM',
            zoomMeetingId: 'test-123456',
            zoomPassword: 'test123',
            zoomLink: 'https://zoom.us/j/test123456'
          };
          break;
        case 'package-purchase':
        case 'package-purchase-confirmation':
          testData = {
            ...testData,
            packageType: 'five',
            packagePrice: 53,
            classesAdded: 5,
            totalClasses: 5
          };
          break;
        case 'class-cancellation':
          testData = {
            ...testData,
            className: 'Test Yoga Class',
            teacher: 'Test Teacher',
            date: new Date().toLocaleDateString(),
            time: '6:00 PM'
          };
          break;
      }

      await EmailService.sendEmail({
        type: emailType,
        data: testData
      });

      addTestResult(
        emailTypeInfo?.name || emailType, 
        'success', 
        `Email sent successfully to ${emailTypeInfo?.recipient}`,
        { emailType, recipient: emailTypeInfo?.recipient }
      );
      
      toast.success(`${emailTypeInfo?.name} email sent successfully!`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addTestResult(
        emailTypeInfo?.name || emailType, 
        'error', 
        `Email test failed: ${errorMessage}`,
        { error: errorMessage }
      );
      toast.error(`Failed to send ${emailTypeInfo?.name} email`);
    } finally {
      setIsLoading(false);
    }
  };

  const testAllEmails = async () => {
    setIsLoading(true);
    addTestResult('All Emails', 'success', 'Starting comprehensive email test...');
    
    for (const emailType of emailTypes) {
      try {
        await testEmailType(emailType.id);
        // Small delay between emails
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        // Error already handled in testEmailType
      }
    }
    
    addTestResult('All Emails', 'success', 'Comprehensive email test completed');
    setIsLoading(false);
  };

  const testEmailService = async () => {
    setIsLoading(true);
    try {
      addTestResult('Email Service', 'success', 'Testing email service connection...');
      
      // Test with a simple registration inquiry
      await EmailService.sendEmail({
        type: 'registration-inquiry',
        data: {
          firstName: 'Service',
          lastName: 'Test',
          email: testEmail,
          interestLevel: 'Test',
          yogaGoals: 'Testing email service connectivity'
        }
      });

      addTestResult('Email Service', 'success', 'Email service is working correctly');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addTestResult('Email Service', 'error', `Email service test failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="space-y-6">
      {/* Test Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Test Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="testEmail">Test Email</Label>
              <Input
                id="testEmail"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="testName">Test Name</Label>
              <Input
                id="testName"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="Test User"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="testMessage">Test Message</Label>
            <Textarea
              id="testMessage"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Enter test message content..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Types */}
      <Card>
        <CardHeader>
          <CardTitle>Available Email Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emailTypes.map((emailType) => (
              <div key={emailType.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{emailType.name}</h4>
                  <Badge variant="outline">{emailType.recipient}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{emailType.description}</p>
                <Button
                  onClick={() => testEmailType(emailType.id)}
                  disabled={isLoading}
                  size="sm"
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Test {emailType.name}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={testEmailService}
              disabled={isLoading}
              className="w-full"
            >
              <Mail className="w-4 h-4 mr-2" />
              Test Email Service
            </Button>
            <Button
              onClick={testAllEmails}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              Test All Emails
            </Button>
            <Button
              onClick={clearResults}
              variant="outline"
              className="w-full"
            >
              <Eye className="w-4 h-4 mr-2" />
              Clear Results
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Test Results</CardTitle>
            <Badge variant="outline">{testResults.length} tests</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No test results yet. Run a test to see results here.</p>
          ) : (
            <div className="space-y-2">
              {testResults.map((result) => (
                <div
                  key={result.id}
                  className={`p-3 rounded-lg border ${
                    result.status === 'success' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {result.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="font-medium">{result.test}</span>
                      <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                        {result.status}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{result.timestamp}</span>
                  </div>
                  <p className="mt-1 text-sm">{result.message}</p>
                  {result.details && (
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
