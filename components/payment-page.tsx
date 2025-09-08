import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { ArrowLeft, CreditCard, Mail, Calendar, Clock, User, AlertTriangle, CheckCircle } from 'lucide-react';
import { ClassManagementService } from '../utils/class-management';
import { DatabaseService } from '../utils/database';

interface PaymentPageProps {
  onBack: () => void;
  selectedClass: {
    className: string;
    teacher: string;
    time: string;
    day: string;
    classId?: string;
  } | null;
  selectedPackage: {
    type: 'single' | 'five' | 'ten';
    price: number;
    name: string;
  } | null;
  user: { email: string; name?: string; classPacks: { fivePack: number; tenPack: number } } | null;
  onPackagePurchase?: (packageType: 'single' | 'five' | 'ten') => void;
  onUseClassPack?: () => void;
}

export function PaymentPage({ 
  onBack, 
  selectedClass, 
  selectedPackage,
  user, 
  onPackagePurchase, 
  onUseClassPack 
}: PaymentPageProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any | null>(null);
  const [studentInfo, setStudentInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'zelle' | 'package'>('zelle');
  const [zelleEmail, setZelleEmail] = useState('');

  const totalClasses = user ? user.classPacks.fivePack + user.classPacks.tenPack : 0;
  const canUsePackage = totalClasses > 0 && selectedClass; // Can only use package for class bookings, not package purchases

  const isPackagePurchase = selectedPackage && !selectedClass;
  const isClassBooking = selectedClass && !selectedPackage;

  const handleBooking = async () => {
    if (!studentInfo.name || !studentInfo.email) {
      alert('Please fill in all required fields');
      return;
    }

    if (paymentMethod === 'zelle' && !zelleEmail) {
      alert('Please provide your Zelle email for payment');
      return;
    }

    setIsProcessing(true);
    
    try {
      if (isPackagePurchase && selectedPackage) {
        // Handle package purchase - only for 'five' and 'ten' packages
        if (selectedPackage.type === 'single') {
          alert('Single class purchases should be handled as class bookings');
          setIsProcessing(false);
          return;
        }

        const success = await DatabaseService.createPackage({
          student_email: studentInfo.email,
          package_type: selectedPackage.type as 'five' | 'ten',
          total_classes: selectedPackage.type === 'five' ? 5 : 10,
          remaining_classes: selectedPackage.type === 'five' ? 5 : 10
        });

        if (success) {
          // Update user's class packs
          if (onPackagePurchase) {
            onPackagePurchase(selectedPackage.type);
          }
          
          setBookingComplete(true);
          setBookingDetails({
            id: 'package-purchase',
            studentName: studentInfo.name,
            studentEmail: studentInfo.email,
            className: selectedPackage.name,
            teacher: 'Package Purchase',
            date: new Date().toLocaleDateString(),
            time: 'N/A',
            timestamp: new Date(),
            paymentMethod: 'Zelle',
            amount: selectedPackage.price
          });
        } else {
          alert('Failed to purchase package. Please try again.');
        }
      } else if (isClassBooking && selectedClass) {
        // Handle class booking
        const booking = await DatabaseService.createBooking({
          student_name: studentInfo.name,
          student_email: studentInfo.email,
          class_name: selectedClass.className,
          teacher: selectedClass.teacher,
          class_date: selectedClass.day,
          class_time: selectedClass.time,
          payment_method: paymentMethod === 'zelle' ? 'Zelle' : 'Class Package',
          amount: paymentMethod === 'zelle' ? 10.00 : 0.00,
          zoom_meeting_id: '',
          zoom_password: '',
          zoom_link: ''
        });

        if (booking) {
          setBookingDetails(booking);
          setBookingComplete(true);
          
          // Use class pack if applicable
          if (paymentMethod === 'package' && onUseClassPack) {
            onUseClassPack();
          }
        } else {
          alert('Failed to book class. Please try again.');
        }
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (bookingComplete && bookingDetails) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-800">
                  {isPackagePurchase ? 'Package Purchased Successfully!' : 'Class Booked Successfully!'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-3">
                    {isPackagePurchase ? 'Package Details' : 'Class Details'}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span><strong>{isPackagePurchase ? 'Package:' : 'Class:'}</strong> {bookingDetails.className}</span>
                    </div>
                    {isClassBooking && selectedClass && (
                      <>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span><strong>Teacher:</strong> {selectedClass.teacher}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span><strong>Date & Time:</strong> {selectedClass.day} at {selectedClass.time}</span>
                        </div>
                      </>
                    )}
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <span><strong>Payment:</strong> {bookingDetails.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                {isPackagePurchase && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-lg mb-3 text-blue-800">How to Use Your Package</h3>
                    <div className="space-y-2 text-sm">
                      <p>• Visit our class schedule to book any available class</p>
                      <p>• When booking, select "Use Class Package" instead of paying</p>
                      <p>• One class will be deducted from your package</p>
                      <p>• You'll receive Zoom details when you book a specific class</p>
                      <p>• Classes never expire - use them anytime!</p>
                    </div>
                  </div>
                )}

                {isClassBooking && bookingDetails.zoomLink && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-lg mb-3 text-blue-800">Zoom Meeting Details</h3>
                    <div className="space-y-2">
                      <p><strong>Meeting ID:</strong> {bookingDetails.zoomMeetingId}</p>
                      {bookingDetails.zoomPassword && (
                        <p><strong>Password:</strong> {bookingDetails.zoomPassword}</p>
                      )}
                      <div className="mt-3">
                        <Button 
                          onClick={() => window.open(bookingDetails.zoomLink, '_blank')}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          Join Zoom Meeting
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">Important Reminders:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {isPackagePurchase ? (
                      <>
                        <li>• Check your email for package confirmation</li>
                        <li>• Visit the class schedule to book your first class</li>
                        <li>• Your package credits never expire</li>
                      </>
                    ) : (
                      <>
                        <li>• Please join 5 minutes before class starts</li>
                        <li>• Have your yoga mat ready</li>
                        <li>• Ensure you have a quiet space for practice</li>
                        <li>• Wear comfortable clothing</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="text-center">
                  <Button onClick={onBack} variant="outline" className="mr-4">
                    Back to Home
                  </Button>
                  {isClassBooking && bookingDetails.zoomLink && (
                    <Button 
                      onClick={() => window.open(bookingDetails.zoomLink, '_blank')}
                    >
                      Join Class Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
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
            <h1 className="text-2xl font-heading">Payment</h1>
          </div>

          {/* Payment Method - Zelle Only */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">Zelle Payment Required</h3>
                </div>
                <p className="text-green-700 text-sm mb-3">
                  Please send your payment using Zelle to the number below. Include your name and class/package details in the memo.
                </p>
                <div className="bg-white border border-green-300 rounded p-3">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Send Zelle payment to:</p>
                    <p className="text-2xl font-bold text-green-800">(805) 807-4894</p>
                    <p className="text-sm text-gray-600 mt-1">Include: Your Name + {selectedClass ? 'Class Details' : 'Package Type'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <h4 className="font-semibold text-yellow-800">Important Notes</h4>
                </div>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Payment must be sent via Zelle to (805) 807-4894</li>
                  <li>• Include your full name in the Zelle memo</li>
                  <li>• Include class/package details in the memo</li>
                  <li>• No refunds - all sales are final</li>
                  <li>• You will receive confirmation via email after payment</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedClass ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Single Class</span>
                    <span className="font-bold">$11.00</span>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><strong>Class:</strong> {selectedClass.className}</p>
                    <p><strong>Teacher:</strong> {selectedClass.teacher}</p>
                    <p><strong>Date:</strong> {selectedClass.day}</p>
                    <p><strong>Time:</strong> {selectedClass.time}</p>
                  </div>
                </div>
              ) : selectedPackage ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">{selectedPackage.name}</span>
                    <span className="font-bold">${selectedPackage.price.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p><strong>Package Type:</strong> {selectedPackage.type === 'single' ? 'Single Class' : selectedPackage.type === 'five' ? '5-Class Package' : '10-Class Package'}</p>
                    <p><strong>Classes Included:</strong> {selectedPackage.type === 'single' ? '1' : selectedPackage.type === 'five' ? '5' : '10'}</p>
                  </div>
                </div>
              ) : null}

              <Separator className="my-4" />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${selectedClass ? '10.00' : selectedPackage ? selectedPackage.price.toFixed(2) : '0.00'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Student Information Form */}
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

          {/* Payment Instructions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Payment Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Step 1: Send Zelle Payment</h4>
                  <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
                    <li>Open your Zelle app or bank's Zelle feature</li>
                    <li>Send payment to: <strong>(805) 807-4894</strong></li>
                    <li>Amount: <strong>${selectedClass ? '10.00' : selectedPackage ? selectedPackage.price.toFixed(2) : '0.00'}</strong></li>
                    <li>Memo: <strong>{studentInfo.name} - {selectedClass ? selectedClass.className : selectedPackage?.name}</strong></li>
                  </ol>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Step 2: Complete Booking</h4>
                  <p className="text-gray-700 text-sm">
                    After sending the Zelle payment, click "Complete Booking" below. 
                    You will receive a confirmation email with your class details and Zoom link (for single classes) 
                    or package confirmation (for packages).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Complete Booking Button */}
          <div className="flex gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBooking}
              disabled={isProcessing || !studentInfo.name || !studentInfo.email || (paymentMethod === 'zelle' && !zelleEmail)}
              className="flex-1"
            >
              {isProcessing ? 'Processing...' : 'Complete Booking'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}