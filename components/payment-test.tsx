import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { CreditCard, DollarSign, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { StripePaymentService } from '../utils/stripe-payment';
import { DatabaseService } from '../utils/database';

export function PaymentTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [testAmount, setTestAmount] = useState('1.00');
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testName, setTestName] = useState('Test User');

  const testPaymentMethods = [
    { id: 'card', name: 'Credit Card (Test)', description: 'Test with Stripe test card' },
    { id: 'package', name: 'Package Purchase', description: 'Test package purchase flow' },
    { id: 'webhook', name: 'Webhook Test', description: 'Test webhook endpoint' },
    { id: 'refund', name: 'Refund Test', description: 'Test refund process' }
  ];

  const testCards = [
    { number: '4242424242424242', name: 'Visa (Success)', cvc: '123', exp: '12/25' },
    { number: '4000000000000002', name: 'Visa (Declined)', cvc: '123', exp: '12/25' },
    { number: '4000000000009995', name: 'Visa (Insufficient Funds)', cvc: '123', exp: '12/25' },
    { number: '4000000000000069', name: 'Visa (Expired Card)', cvc: '123', exp: '12/25' }
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

  const testStripeConnection = async () => {
    setIsLoading(true);
    try {
      addTestResult('Stripe Connection', 'success', 'Testing Stripe API connection...');
      
      // Test creating a payment intent
      const paymentData = {
        amount: Math.round(parseFloat(testAmount) * 100), // Convert to cents
        currency: 'usd',
        studentName: testName,
        studentEmail: testEmail,
        metadata: {
          test: 'true',
          email: testEmail,
          name: testName
        }
      };

      const clientSecret = await StripePaymentService.createPaymentIntent(paymentData);
      
      if (clientSecret) {
        addTestResult('Stripe Connection', 'success', 'Stripe API connection successful!', { clientSecret: clientSecret.substring(0, 20) + '...' });
      } else {
        addTestResult('Stripe Connection', 'error', 'Failed to create payment intent');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addTestResult('Stripe Connection', 'error', `Stripe connection failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testPackagePurchase = async () => {
    setIsLoading(true);
    try {
      addTestResult('Package Purchase', 'success', 'Testing package purchase flow...');
      
      // Simulate package purchase
      const packageData = {
        type: 'five' as const,
        price: 53.00,
        studentEmail: testEmail,
        studentName: testName
      };

      // Test database operations
      const userRecord = await DatabaseService.createOrUpdateUser({
        email: testEmail,
        name: testName
      });

      if (userRecord) {
        addTestResult('Package Purchase', 'success', 'User created/updated successfully', { userId: userRecord.id });
        
        // Test credit update
        await DatabaseService.updateUserCredits(userRecord.id, {
          single_classes: 0,
          five_pack_classes: 5,
          ten_pack_classes: 0
        });

        addTestResult('Package Purchase', 'success', 'Credits updated successfully');
      } else {
        addTestResult('Package Purchase', 'error', 'Failed to create/update user');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addTestResult('Package Purchase', 'error', `Package purchase test failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testWebhookEndpoint = async () => {
    setIsLoading(true);
    try {
      addTestResult('Webhook Test', 'success', 'Testing webhook endpoint...');
      
      const webhookUrl = '/.netlify/functions/stripe-webhook';
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'test',
          data: { test: true }
        })
      });

      if (response.ok) {
        addTestResult('Webhook Test', 'success', 'Webhook endpoint is accessible', { status: response.status });
      } else {
        addTestResult('Webhook Test', 'error', `Webhook returned error: ${response.status}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addTestResult('Webhook Test', 'error', `Webhook test failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testEnvironmentVariables = () => {
    const requiredVars = [
      'VITE_STRIPE_PUBLISHABLE_KEY',
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET'
    ];

    const missingVars = requiredVars.filter(varName => {
      if (varName.startsWith('VITE_')) {
        return !import.meta.env[varName];
      }
      return false; // Server-side vars can't be checked from client
    });

    if (missingVars.length === 0) {
      addTestResult('Environment Variables', 'success', 'All client-side environment variables are set');
    } else {
      addTestResult('Environment Variables', 'error', `Missing environment variables: ${missingVars.join(', ')}`);
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
            <CreditCard className="w-5 h-5" />
            Payment Test Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="testAmount">Test Amount ($)</Label>
              <Input
                id="testAmount"
                type="number"
                step="0.01"
                value={testAmount}
                onChange={(e) => setTestAmount(e.target.value)}
                placeholder="1.00"
              />
            </div>
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
        </CardContent>
      </Card>

      {/* Test Cards Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Stripe Test Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testCards.map((card, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="font-medium">{card.name}</div>
                <div className="text-sm text-muted-foreground">Card: {card.number}</div>
                <div className="text-sm text-muted-foreground">CVC: {card.cvc} | Exp: {card.exp}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Run Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={testEnvironmentVariables}
              variant="outline"
              className="w-full"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Check Environment
            </Button>
            <Button
              onClick={testStripeConnection}
              disabled={isLoading}
              className="w-full"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Test Stripe API
            </Button>
            <Button
              onClick={testPackagePurchase}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Test Package Purchase
            </Button>
            <Button
              onClick={testWebhookEndpoint}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Test Webhook
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Test Results</CardTitle>
            <Button onClick={clearResults} variant="outline" size="sm">
              Clear Results
            </Button>
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
