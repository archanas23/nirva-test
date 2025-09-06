import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, CreditCard, Phone, Mail, CheckCircle, Copy } from 'lucide-react';

interface SimplePaymentPageProps {
  onBack: () => void;
  selectedClass?: any;
  selectedPackage?: any;
  onSuccess: () => void;
}

export function SimplePaymentPage({ onBack, selectedClass, selectedPackage, onSuccess }: SimplePaymentPageProps) {
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [confirmationNumber, setConfirmationNumber] = useState<string>('');
  const [step, setStep] = useState<'form' | 'instructions' | 'complete'>('form');

  const generateConfirmationNumber = () => {
    const number = 'NY' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setConfirmationNumber(number);
    return number;
  };

  const handleSubmit = () => {
    if (!studentInfo.name || !studentInfo.email) return;
    
    const confNumber = generateConfirmationNumber();
    setStep('instructions');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (step === 'instructions') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-heading mb-2">Booking Confirmed!</h1>
              <p className="text-muted-foreground">
                Please complete your payment and send confirmation to finalize your booking.
              </p>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Payment Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Step 1: Zelle Payment */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-3">Step 1: Send Zelle Payment</h4>
                    <div className="space-y-2">
                      <p className="text-blue-700 text-sm"><strong>Send to:</strong> (805) 807-4894</p>
                      <p className="text-blue-700 text-sm"><strong>Amount:</strong> ${selectedClass ? '10.00' : selectedPackage ? selectedPackage.price.toFixed(2) : '0.00'}</p>
                      <p className="text-blue-700 text-sm"><strong>Memo:</strong> {confirmationNumber}</p>
                    </div>
                  </div>

                  {/* Step 2: Send Confirmation */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-3">Step 2: Send Confirmation</h4>
                    <p className="text-green-700 text-sm mb-3">
                      After sending payment, text or WhatsApp this confirmation:
                    </p>
                    
                    <div className="bg-white border border-green-300 rounded p-3 mb-3">
                      <p className="text-sm font-mono">
                        Hi! I just sent Zelle payment for my yoga booking. Confirmation: {confirmationNumber}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(`Hi! I just sent Zelle payment for my yoga booking. Confirmation: ${confirmationNumber}`)}
                        className="flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Text
                      </Button>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-3">Send Confirmation To:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-yellow-700" />
                        <span className="text-yellow-700 text-sm">(805) 807-4894</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard('(805) 807-4894')}
                        >
                          Copy
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-yellow-700" />
                        <span className="text-yellow-700 text-sm">admin@nirvayoga.com</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard('admin@nirvayoga.com')}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {selectedClass ? 'Single Class' : selectedPackage?.name}
                    </span>
                    <span className="font-bold">
                      ${selectedClass ? '10.00' : selectedPackage ? selectedPackage.price.toFixed(2) : '0.00'}
                    </span>
                  </div>
                  
                  {selectedClass && (
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><strong>Class:</strong> {selectedClass.className}</p>
                      <p><strong>Teacher:</strong> {selectedClass.teacher}</p>
                      <p><strong>Date:</strong> {selectedClass.day}</p>
                      <p><strong>Time:</strong> {selectedClass.time}</p>
                    </div>
                  )}
                  
                  {selectedPackage && (
                    <div className="text-sm text-muted-foreground">
                      <p><strong>Package Type:</strong> {selectedPackage.type === 'five' ? '5-Class Package' : '10-Class Package'}</p>
                      <p><strong>Classes Included:</strong> {selectedPackage.type === 'five' ? '5' : '10'}</p>
                    </div>
                  )}

                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${selectedClass ? '10.00' : selectedPackage ? selectedPackage.price.toFixed(2) : '0.00'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                onClick={onBack}
                variant="outline"
                className="flex-1"
              >
                Back to Classes
              </Button>
              <Button
                onClick={() => setStep('complete')}
                className="flex-1"
              >
                I've Sent Payment & Confirmation
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-heading mb-2">Thank You!</h1>
            <p className="text-muted-foreground mb-6">
              We've received your payment confirmation. You'll get a confirmation email with your class details and Zoom link within 24 hours.
            </p>
            <Button onClick={onSuccess} className="w-full">
              Continue to Classes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-2xl font-heading">Book Your Class</h1>
          </div>

          {/* Payment Method */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">Zelle Payment</h3>
                </div>
                <p className="text-green-700 text-sm">
                  Pay securely via Zelle to (805) 807-4894. No transaction fees!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Student Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="studentName">Full Name *</Label>
                  <Input
                    id="studentName"
                    value={studentInfo.name}
                    onChange={(e) => setStudentInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="studentEmail">Email Address *</Label>
                  <Input
                    id="studentEmail"
                    type="email"
                    value={studentInfo.email}
                    onChange={(e) => setStudentInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="studentPhone">Phone Number</Label>
                  <Input
                    id="studentPhone"
                    value={studentInfo.phone}
                    onChange={(e) => setStudentInfo(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!studentInfo.name || !studentInfo.email}
            className="w-full"
          >
            Continue to Payment Instructions
          </Button>
        </div>
      </div>
    </div>
  );
}
    