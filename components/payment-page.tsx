import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { ArrowLeft, Smartphone, Copy, CheckCircle } from "lucide-react";
import { NirvaLogo } from "./nirva-logo";
import { sendAdminNotification, sendStudentConfirmation } from "../utils/admin-notifications";
import { getZoomMeetingForClass } from "../utils/zoom-meeting-generator";
import { toast } from "sonner";

interface PaymentPageProps {
  onBack: () => void;
  selectedClass?: {
    className: string;
    teacher: string;
    time: string;
    day: string;
    classId?: string;
  } | null;
  user?: {
    email: string;
    name?: string;
    classPacks: {
      fivePack: number;
      tenPack: number;
    };
  } | null;
  onPackagePurchase?: (packageType: 'single' | 'five' | 'ten') => void;
  onUseClassPack?: () => void;
}

export function PaymentPage({ onBack, selectedClass, user, onPackagePurchase, onUseClassPack }: PaymentPageProps) {
  const [selectedPackage, setSelectedPackage] = useState<"single" | "five" | "ten">("single");
  const [zelleData, setZelleData] = useState({
    name: "",
    email: "",
    confirmationCode: ""
  });
  const [paymentStep, setPaymentStep] = useState<"select" | "zelle" | "confirm">("select");
  const [copiedPhone, setCopiedPhone] = useState(false);
  
  // Nirva Yoga Studio Zelle information
  const ZELLE_PHONE = "(805) 807-4894";
  const STUDIO_NAME = "Nirva Yoga Studio";

  const packagePrices = {
    single: { price: 10.00, description: "Single Class" },
    five: { price: 48.00, description: "5-Class Package", savings: 2.00, originalPrice: 50.00 },
    ten: { price: 95.00, description: "10-Class Package", savings: 5.00, originalPrice: 100.00 }
  };

  const copyPhoneNumber = () => {
    navigator.clipboard.writeText('8058074894');
    setCopiedPhone(true);
    toast.success('Phone number copied to clipboard!');
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleZelleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!zelleData.name || !zelleData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Process Zelle payment confirmation
    if (onPackagePurchase) {
      onPackagePurchase(selectedPackage);
    }

    // Send admin notification with Zelle payment details
    if (selectedClass && user) {
      try {
        const bookingDetails = {
          studentName: zelleData.name,
          studentEmail: user.email,
          className: selectedClass.className,
          teacher: selectedClass.teacher,
          date: selectedClass.day,
          time: selectedClass.time
        };

        // Generate unique Zoom meeting for this specific class session
        const zoomMeeting = getZoomMeetingForClass(
          selectedClass.classId || 'default',
          selectedClass.className,
          selectedClass.day,
          selectedClass.teacher
        );

        await sendAdminNotification({
          ...bookingDetails,
          paymentMethod: `Zelle - ${zelleData.confirmationCode || 'Pending Confirmation'}`,
          amount: packagePrices[selectedPackage].price,
          zoomLink: zoomMeeting.zoomLink,
          meetingId: zoomMeeting.meetingId,
          passcode: zoomMeeting.passcode
        });
        await sendStudentConfirmation({
          ...bookingDetails,
          zoomLink: zoomMeeting.zoomLink,
          meetingId: zoomMeeting.meetingId, 
          passcode: zoomMeeting.passcode
        });
        
        // Show updated class pack info
        let packInfo = "";
        if (selectedPackage === 'five') {
          packInfo = `\n🎫 5 classes will be added after payment verification!`;
        } else if (selectedPackage === 'ten') {
          packInfo = `\n🎫 10 classes will be added after payment verification!`;
        }
        
        alert(`✅ Zelle payment submitted!\n📧 Admin notified for verification.${packInfo}\n\nYour class will be confirmed within 1 hour after payment verification.`);
      } catch (error) {
        console.error('Error sending notifications:', error);
        alert(`✅ Zelle payment submitted!\n\nWe'll verify your payment and confirm your booking within 1 hour.`);
      }
    } else {
      // Package purchase without specific class
      let packInfo = "";
      if (selectedPackage === 'five') {
        packInfo = `\n🎫 5 classes will be added after verification!`;
      } else if (selectedPackage === 'ten') {
        packInfo = `\n🎫 10 classes will be added after verification!`;
      }
      alert(`✅ Zelle payment submitted!${packInfo}\n\nWe'll verify your payment within 1 hour.`);
    }
    
    onBack();
  };

  const handleProceedToZelle = () => {
    setPaymentStep("zelle");
  };

  const canUseClassPack = user && (user.classPacks.fivePack > 0 || user.classPacks.tenPack > 0) && selectedClass;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Schedule
          </Button>
          <div className="flex items-center gap-4 mb-4">
            <NirvaLogo size="sm" />
            <h1>Complete Your Booking</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Package</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedClass && (
                <div className="p-4 bg-accent rounded-lg mb-4">
                  <h3 className="mb-2">{selectedClass.className}</h3>
                  <p className="text-muted-foreground">
                    {selectedClass.day} at {selectedClass.time}
                  </p>
                  <p className="text-muted-foreground">
                    with {selectedClass.teacher}
                  </p>
                </div>
              )}

              {canUseClassPack && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                  <h4 className="font-medium text-green-800 mb-2">Use Existing Class Pack</h4>
                  <div className="space-y-2 text-sm">
                    {user.classPacks.fivePack > 0 && (
                      <p className="text-green-700">5-Class Package: {user.classPacks.fivePack} classes available</p>
                    )}
                    {user.classPacks.tenPack > 0 && (
                      <p className="text-green-700">10-Class Package: {user.classPacks.tenPack} classes available</p>
                    )}
                  </div>
                  <Button 
                    className="mt-3 w-full" 
                    onClick={async () => {
                      // Use one class from the pack
                      if (onUseClassPack) {
                        onUseClassPack();
                      }

                      // Send admin notification for class pack booking
                      if (selectedClass && user) {
                        try {
                          const bookingDetails = {
                            studentName: user.name || user.email.split('@')[0],
                            studentEmail: user.email,
                            className: selectedClass.className,
                            teacher: selectedClass.teacher,
                            date: selectedClass.day,
                            time: selectedClass.time
                          };

                          // Generate unique Zoom meeting for this class session
                          const zoomMeeting = getZoomMeetingForClass(
                            selectedClass.classId || 'default',
                            selectedClass.className,
                            selectedClass.day,
                            selectedClass.teacher
                          );

                          await sendAdminNotification({
                            ...bookingDetails,
                            zoomLink: zoomMeeting.zoomLink,
                            meetingId: zoomMeeting.meetingId,
                            passcode: zoomMeeting.passcode
                          });
                          await sendStudentConfirmation({
                            ...bookingDetails,
                            zoomLink: zoomMeeting.zoomLink,
                            meetingId: zoomMeeting.meetingId,
                            passcode: zoomMeeting.passcode
                          });
                          
                          // Calculate remaining classes
                          const remainingFive = Math.max(0, (user.classPacks.fivePack || 0) - (user.classPacks.tenPack > 0 ? 0 : 1));
                          const remainingTen = Math.max(0, (user.classPacks.tenPack || 0) - (user.classPacks.tenPack > 0 ? 1 : 0));
                          const totalRemaining = remainingFive + remainingTen;
                          
                          alert(`✅ Class booked using your package!\n\n📧 Confirmation emails sent.\n🎫 You have ${totalRemaining} classes remaining in your packages.`);
                        } catch (error) {
                          console.error('Error sending notifications:', error);
                          const totalRemaining = (user.classPacks.fivePack || 0) + (user.classPacks.tenPack || 0) - 1;
                          alert(`✅ Class booked using your package!\n🎫 You have ${totalRemaining} classes remaining.`);
                        }
                      } else {
                        alert("Class booked using your existing package!");
                      }
                      onBack();
                    }}
                  >
                    Book with Class Pack - FREE
                  </Button>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-medium">Or Purchase New Package:</h4>
                
                {/* Single Class */}
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedPackage === 'single' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedPackage('single')}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Single Class</h4>
                      <p className="text-sm text-muted-foreground">$10/class</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$10.00</p>
                      <p className="text-xs text-muted-foreground">inc. processing</p>
                    </div>
                  </div>
                </div>

                {/* 5-Class Package */}
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedPackage === 'five' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedPackage('five')}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">5-Class Package</h4>
                      <p className="text-sm text-muted-foreground">$9.60/class • Never expires</p>
                      <p className="text-xs text-green-600">Save $2.00!</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$48.00</p>
                      <p className="text-xs text-muted-foreground line-through">$50.00</p>
                    </div>
                  </div>
                </div>

                {/* 10-Class Package */}
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedPackage === 'ten' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedPackage('ten')}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">10-Class Package</h4>
                      <p className="text-sm text-muted-foreground">$9.50/class • Never expires • Best Value!</p>
                      <p className="text-xs text-green-600">Save $5.00!</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$95.00</p>
                      <p className="text-xs text-muted-foreground line-through">$100.00</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="mb-2">What's Included</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Live virtual classes via Zoom</li>
                  <li>• Interactive instruction from certified teachers</li>
                  <li>• Class recordings available upon request</li>
                  <li>• Pose modifications for all levels</li>
                  <li>• Community support and guidance</li>
                  {selectedPackage !== 'single' && <li>• Classes never expire!</li>}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Pay with Zelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              {paymentStep === "select" && (
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Why Zelle?</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>✓ No processing fees - more value for you</li>
                      <li>✓ Instant transfers from your bank</li>
                      <li>✓ Secure and trusted by major banks</li>
                      <li>✓ No need to share card details</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Payment Details</h4>
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Amount to Pay:</span>
                        <span className="font-bold text-lg">${packagePrices[selectedPackage].price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Package:</span>
                        <span>{packagePrices[selectedPackage].description}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleProceedToZelle} 
                    className="w-full" 
                    size="lg"
                  >
                    Continue with Zelle Payment
                  </Button>
                </div>
              )}

              {paymentStep === "zelle" && (
                <div className="space-y-6">
                  <div className="p-4 bg-accent rounded-lg">
                    <h4 className="font-medium mb-3">Step 1: Send Payment via Zelle</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                          <p className="text-sm text-muted-foreground">Send to:</p>
                          <p className="font-medium">{STUDIO_NAME}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                          <p className="text-sm text-muted-foreground">Phone Number:</p>
                          <p className="font-bold text-lg">{ZELLE_PHONE}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={copyPhoneNumber}
                          className="flex items-center gap-1"
                        >
                          {copiedPhone ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copiedPhone ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                          <p className="text-sm text-muted-foreground">Amount:</p>
                          <p className="font-bold text-lg text-primary">${packagePrices[selectedPackage].price.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-white rounded border">
                        <p className="text-sm text-muted-foreground mb-1">Message (Include this):</p>
                        <p className="font-medium">
                          {selectedClass 
                            ? `${selectedClass.className} - ${selectedClass.day} ${selectedClass.time}`
                            : packagePrices[selectedPackage].description
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      💡 <strong>Open your bank app</strong> and find "Zelle" or "Send Money" to send ${packagePrices[selectedPackage].price.toFixed(2)} to {ZELLE_PHONE}
                    </p>
                  </div>

                  <form onSubmit={handleZelleSubmit} className="space-y-4">
                    <h4 className="font-medium">Step 2: Confirm Your Payment</h4>
                    
                    <div>
                      <Label htmlFor="fullName">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={zelleData.name}
                        onChange={(e) => setZelleData({...zelleData, name: e.target.value})}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Must match the name on your Zelle account
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmEmail">
                        Email Address <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="confirmEmail"
                        type="email"
                        placeholder="Enter your email"
                        value={zelleData.email}
                        onChange={(e) => setZelleData({...zelleData, email: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmationCode">
                        Zelle Confirmation Code (Optional)
                      </Label>
                      <Input
                        id="confirmationCode"
                        type="text"
                        placeholder="e.g., ZLE123456 (if available)"
                        value={zelleData.confirmationCode}
                        onChange={(e) => setZelleData({...zelleData, confirmationCode: e.target.value})}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Check your Zelle confirmation for this code
                      </p>
                    </div>
                    
                    <Button type="submit" className="w-full mt-6" size="lg">
                      Confirm Zelle Payment Sent
                    </Button>
                  </form>
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p className="flex items-center gap-2">
                    <span>🔒</span> Your information is secure and private
                  </p>
                  <p className="flex items-center gap-2">
                    <span>⚡</span> Payment verification typically takes 5-10 minutes
                  </p>
                  <p className="flex items-center gap-2">
                    <span>✉️</span> You'll receive email confirmation once verified
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}