import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Calendar, Clock, User, Video, Copy, CheckCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface UpcomingClass {
  id: string;
  className: string;
  teacher: string;
  date: string;
  time: string;
  zoomLink: string;
  meetingId: string;
  passcode: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookingDate: string;
}

interface UserZoomClassesProps {
  userEmail: string;
}

export function UserZoomClasses({ userEmail }: UserZoomClassesProps) {
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([
    {
      id: "3",
      className: "Power Yoga",
      teacher: "Archana Soundararajan",
      date: "Monday, Sep 9, 2025",
      time: "7:30 AM EST",
      zoomLink: "https://zoom.us/j/487291635?pwd=pow123",
      meetingId: "487 291 635",
      passcode: "POW123",
      status: "confirmed",
      bookingDate: "Sep 7, 2025"
    },
    {
      id: "4",
      className: "Gentle Hatha",
      teacher: "Harshada Madiraju", 
      date: "Monday, Sep 9, 2025",
      time: "6:30 PM EST",
      zoomLink: "https://zoom.us/j/592847163?pwd=gen456",
      meetingId: "592 847 163",
      passcode: "GEN456",
      status: "confirmed",
      bookingDate: "Sep 8, 2025"
    },
    {
      id: "5",
      className: "Vinyasa Flow",
      teacher: "Archana Soundararajan",
      date: "Tuesday, Sep 10, 2025", 
      time: "6:30 PM EST",
      zoomLink: "https://zoom.us/j/738294516?pwd=vin789",
      meetingId: "738 294 516",
      passcode: "VIN789",
      status: "pending",
      bookingDate: "Sep 8, 2025"
    }
  ]);

  const [copiedItems, setCopiedItems] = useState<Record<string, boolean>>({});

  const copyToClipboard = (text: string, type: string, classId: string) => {
    navigator.clipboard.writeText(text);
    const key = `${classId}-${type}`;
    setCopiedItems(prev => ({ ...prev, [key]: true }));
    toast.success(`${type} copied to clipboard!`);
    setTimeout(() => {
      setCopiedItems(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const openZoomMeeting = (zoomLink: string, className: string) => {
    window.open(zoomLink, '_blank');
    toast.success(`Opening ${className} in new tab`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Payment Pending';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const confirmedClasses = upcomingClasses.filter(c => c.status === 'confirmed');
  const pendingClasses = upcomingClasses.filter(c => c.status === 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2">My Upcoming Classes</h3>
        <p className="text-sm text-muted-foreground">
          Your booked classes with Zoom meeting details
        </p>
      </div>

      {/* Confirmed Classes */}
      {confirmedClasses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Video className="w-5 h-5 text-green-600" />
              Ready to Join ({confirmedClasses.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {confirmedClasses.map((classItem) => (
              <div key={classItem.id} className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-green-800">{classItem.className}</h4>
                    <p className="text-sm text-green-700">with {classItem.teacher}</p>
                  </div>
                  <Badge className={getStatusColor(classItem.status)}>
                    {getStatusText(classItem.status)}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {/* Date and Time */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{classItem.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{classItem.time}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Zoom Details */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-sm">Zoom Meeting Details</h5>
                    
                    {/* Join Button */}
                    <Button
                      onClick={() => openZoomMeeting(classItem.zoomLink, classItem.className)}
                      className="w-full"
                      size="sm"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Join Class Now
                    </Button>

                    {/* Meeting Info */}
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center justify-between p-2 bg-white rounded border">
                        <div>
                          <span className="text-muted-foreground">Meeting ID: </span>
                          <span className="font-mono font-medium">{classItem.meetingId}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(classItem.meetingId.replace(/\s/g, ''), "Meeting ID", classItem.id)}
                        >
                          {copiedItems[`${classItem.id}-Meeting ID`] ? 
                            <CheckCircle className="w-3 h-3" /> : 
                            <Copy className="w-3 h-3" />
                          }
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-white rounded border">
                        <div>
                          <span className="text-muted-foreground">Passcode: </span>
                          <span className="font-mono font-medium">{classItem.passcode}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(classItem.passcode, "Passcode", classItem.id)}
                        >
                          {copiedItems[`${classItem.id}-Passcode`] ? 
                            <CheckCircle className="w-3 h-3" /> : 
                            <Copy className="w-3 h-3" />
                          }
                        </Button>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(classItem.zoomLink, "Zoom Link", classItem.id)}
                        className="flex-1"
                      >
                        {copiedItems[`${classItem.id}-Zoom Link`] ? "Copied!" : "Copy Link"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(classItem.zoomLink, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Booked on {classItem.bookingDate}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Pending Payment Classes */}
      {pendingClasses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
              Pending Payment ({pendingClasses.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingClasses.map((classItem) => (
              <div key={classItem.id} className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-yellow-800">{classItem.className}</h4>
                    <p className="text-sm text-yellow-700">with {classItem.teacher}</p>
                  </div>
                  <Badge className={getStatusColor(classItem.status)}>
                    {getStatusText(classItem.status)}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{classItem.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{classItem.time}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-yellow-700 bg-yellow-100 p-3 rounded border">
                    <p className="font-medium">⏳ Payment verification in progress</p>
                    <p className="text-xs mt-1">
                      Zoom details will be sent once payment is confirmed (usually within 1 hour)
                    </p>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Booked on {classItem.bookingDate}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No Classes */}
      {upcomingClasses.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No upcoming classes booked yet.</p>
            <p className="text-sm text-muted-foreground">
              Book a class to see your Zoom meeting details here.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">Need Help?</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>• Join classes 5-10 minutes early to test your connection</p>
            <p>• Make sure you have a stable internet connection</p>
            <p>• Contact us if you don't receive Zoom details 1 hour before class</p>
            <p>• Classes are recorded and available upon request to attendees</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}