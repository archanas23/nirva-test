import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Users, Calendar, DollarSign, Clock, Mail, User, Video, Copy, ExternalLink, Shield, AlertTriangle } from "lucide-react";
import { ScheduleEditor } from "./schedule-editor";
import { ResendTest } from "./resend-test";
import { ZoomTest } from "./zoom-test";
import { TestPayment } from "./test-payment";
import { DatabaseSetup } from "./database-setup";
import { ZoomDebugTest } from "./zoom-debug-test";
import { BookingTest } from "./booking-test";
import { DatabaseTest } from "./database-test";
import { DatabaseService } from "../utils/database";

interface ClassBooking {
  id: string;
  studentName: string;
  studentEmail: string;
  className: string;
  teacher: string;
  date: string;
  time: string;
  timestamp: Date;
  paymentMethod: string;
  amount: number;
  zoomMeetingId?: string;
  zoomPassword?: string;
  zoomLink?: string;
}

interface ClassWithZoom {
  className: string;
  teacher: string;
  date: string;
  time: string;
  zoomMeetingId: string;
  zoomPassword: string;
  zoomLink: string;
  studentCount: number;
  students: ClassBooking[];
}

interface AdminPanelProps {
  user?: { email: string; name?: string } | null;
  onBack?: () => void;
}

// Mock data - in production this would come from your database
const mockBookings: ClassBooking[] = [
  {
    id: "1",
    studentName: "Sarah Johnson",
    studentEmail: "sarah.j@email.com",
    className: "Morning Flow",
    teacher: "Harshada",
    date: "September 10, 2025",
    time: "8:00 AM - 9:00 AM",
    timestamp: new Date("2025-09-05T14:30:00"),
    paymentMethod: "Credit Card",
    amount: 11.00,
    zoomMeetingId: "123456789",
    zoomPassword: "yoga123",
    zoomLink: "https://zoom.us/j/123456789?pwd=yoga123"
  },
  {
    id: "2", 
    studentName: "Mike Chen",
    studentEmail: "mike.chen@email.com",
    className: "Evening Restore",
    teacher: "Archana",
    date: "September 11, 2025",
    time: "7:00 PM - 8:00 PM",
    timestamp: new Date("2025-09-05T16:45:00"),
    paymentMethod: "Credit Card",
    amount: 11.00,
    zoomMeetingId: "987654321",
    zoomPassword: "restore456",
    zoomLink: "https://zoom.us/j/987654321?pwd=restore456"
  },
  {
    id: "3",
    studentName: "Emma Davis",
    studentEmail: "emma.davis@email.com", 
    className: "Power Flow",
    teacher: "Archana",
    date: "September 12, 2025",
    time: "6:00 PM - 7:00 PM",
    timestamp: new Date("2025-09-05T18:20:00"),
    paymentMethod: "5-Class Pack",
    amount: 0.00,
    zoomMeetingId: "456789123",
    zoomPassword: "power789",
    zoomLink: "https://zoom.us/j/456789123?pwd=power789"
  }
];

export function AdminPanel({ user, onBack }: AdminPanelProps) {
  const [bookings, setBookings] = useState<ClassBooking[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [showZoomSetup, setShowZoomSetup] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is authorized to access admin panel
  const isAuthorized = user?.email === 'nirvayogastudio@gmail.com';

  // Load real data from Supabase
  useEffect(() => {
    const loadBookings = async () => {
      if (!isAuthorized) return;
      
      try {
        setLoading(true);
        const dbBookings = await DatabaseService.getBookings();
        
        // Convert database format to component format
        const formattedBookings: ClassBooking[] = dbBookings.map(booking => ({
          id: booking.id,
          studentName: booking.student_name,
          studentEmail: booking.student_email,
          className: booking.class_name,
          teacher: booking.teacher,
          date: booking.class_date,
          time: booking.class_time,
          timestamp: new Date(booking.created_at),
          paymentMethod: booking.payment_method,
          amount: booking.amount,
          zoomMeetingId: booking.zoom_meeting_id,
          zoomPassword: booking.zoom_password,
          zoomLink: booking.zoom_link
        }));
        
        setBookings(formattedBookings);
        console.log('✅ Loaded bookings from database:', formattedBookings.length);
      } catch (error) {
        console.error('❌ Error loading bookings:', error);
        // Fallback to mock data if database fails
        setBookings(mockBookings);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [isAuthorized]);

  // Listen for new bookings
  useEffect(() => {
    const handleNewBooking = (event: CustomEvent) => {
      const bookingData = event.detail;
      const newBooking: ClassBooking = {
        id: Date.now().toString(),
        timestamp: new Date(),
        paymentMethod: "Credit Card",
        amount: 11.00,
        ...bookingData
      };
      
      setBookings(prev => [newBooking, ...prev]);
    };

    window.addEventListener('classBooked', handleNewBooking as EventListener);
    
    return () => {
      window.removeEventListener('classBooked', handleNewBooking as EventListener);
    };
  }, []);

  // Get unique classes for filter
  const uniqueClasses = [...new Set(bookings.map(b => b.className))];
  
  // Filter bookings by selected class
  const filteredBookings = selectedClass === "all" 
    ? bookings 
    : bookings.filter(b => b.className === selectedClass);

  // Group bookings by class with Zoom info
  const classesWithZoom: ClassWithZoom[] = Object.entries(
    bookings.reduce((acc, booking) => {
      const key = `${booking.className}-${booking.teacher}-${booking.date}-${booking.time}`;
      if (!acc[key]) {
        acc[key] = {
          className: booking.className,
          teacher: booking.teacher,
          date: booking.date,
          time: booking.time,
          zoomMeetingId: booking.zoomMeetingId || '',
          zoomPassword: booking.zoomPassword || '',
          zoomLink: booking.zoomLink || '',
          studentCount: 0,
          students: []
        };
      }
      acc[key].students.push(booking);
      acc[key].studentCount++;
      return acc;
    }, {} as Record<string, ClassWithZoom>)
  ).map(([_, classInfo]) => classInfo);

  // Calculate statistics
  const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);
  const totalBookings = bookings.length;
  const todayBookings = bookings.filter(b => 
    new Date(b.timestamp).toDateString() === new Date().toDateString()
  ).length;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Show unauthorized access message if user is not authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
              <p className="text-muted-foreground">
                You don't have permission to access the admin panel.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Admin Access Required</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Only authorized administrators can access this panel.
                </p>
              </div>
              
              {onBack && (
                <Button onClick={onBack} className="w-full">
                  Go Back
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2">Nirva Yoga Studio - Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage class bookings, view student enrollment, and access Zoom links
          </p>
          {loading && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">🔄 Loading data from database...</p>
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{totalBookings}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Today's Bookings</p>
                <p className="text-2xl font-bold">{todayBookings}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Classes Offered</p>
                <p className="text-2xl font-bold">{uniqueClasses.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="zoom-classes" className="space-y-6">
          <TabsList>
            <TabsTrigger value="zoom-classes">Zoom Classes</TabsTrigger>
            <TabsTrigger value="all-bookings">All Bookings</TabsTrigger>
            <TabsTrigger value="by-class">By Class</TabsTrigger>
            <TabsTrigger value="email-test">Email Testing</TabsTrigger>
            <TabsTrigger value="zoom-test">Zoom Testing</TabsTrigger>
            <TabsTrigger value="zoom-debug">Zoom Debug</TabsTrigger>
            <TabsTrigger value="booking-test">Booking Test</TabsTrigger>
            <TabsTrigger value="database-test">Database Test</TabsTrigger>
            <TabsTrigger value="payment-test">Payment Testing</TabsTrigger>
            <TabsTrigger value="database-setup">Database Setup</TabsTrigger>
          </TabsList>

          <TabsContent value="zoom-classes" className="space-y-6">
            <div className="grid gap-6">
              {classesWithZoom.map((classInfo, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Video className="h-5 w-5 text-blue-600" />
                        <span>{classInfo.className}</span>
                        <Badge variant="secondary">
                          {classInfo.studentCount} {classInfo.studentCount === 1 ? 'student' : 'students'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {classInfo.date} • {classInfo.time}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Zoom Meeting Info */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-3">Zoom Meeting Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-blue-700">Meeting ID:</label>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="bg-white px-2 py-1 rounded text-sm">{classInfo.zoomMeetingId}</code>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(classInfo.zoomMeetingId)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-blue-700">Password:</label>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="bg-white px-2 py-1 rounded text-sm">{classInfo.zoomPassword}</code>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(classInfo.zoomPassword)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <label className="text-sm font-medium text-blue-700">Join Link:</label>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="bg-white px-2 py-1 rounded text-sm flex-1 truncate">
                              {classInfo.zoomLink}
                            </code>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(classInfo.zoomLink)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => window.open(classInfo.zoomLink, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Students List */}
                      <div>
                        <h4 className="font-semibold mb-3">Enrolled Students</h4>
                        <div className="space-y-2">
                          {classInfo.students.map((student) => (
                            <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">{student.studentName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  <a href={`mailto:${student.studentEmail}`} className="hover:text-primary">
                                    {student.studentEmail}
                                  </a>
                                </div>
                              </div>
                              <div className="text-right space-y-1">
                                <Badge variant={student.amount > 0 ? "default" : "secondary"} className="text-xs">
                                  {student.paymentMethod}
                                </Badge>
                                <div className="text-xs text-muted-foreground">
                                  Booked: {student.timestamp.toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all-bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Bookings</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedClass === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedClass("all")}
                    >
                      All Classes
                    </Button>
                    {uniqueClasses.map((className) => (
                      <Button
                        key={className}
                        variant={selectedClass === className ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedClass(className)}
                      >
                        {className}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Zoom</TableHead>
                      <TableHead>Booked</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{booking.studentName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <a href={`mailto:${booking.studentEmail}`} className="hover:text-primary">
                                {booking.studentEmail}
                              </a>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{booking.className}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-muted-foreground">{booking.teacher}</div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{booking.date}</div>
                            <div className="text-sm text-muted-foreground">{booking.time}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant={booking.amount > 0 ? "default" : "secondary"}>
                              {booking.paymentMethod}
                            </Badge>
                            {booking.amount > 0 && (
                              <div className="text-sm font-medium">${booking.amount.toFixed(2)}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {booking.zoomLink ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(booking.zoomLink, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Join
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-sm">No link</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {booking.timestamp.toLocaleDateString()} {booking.timestamp.toLocaleTimeString()}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {filteredBookings.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No bookings found for the selected filter.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="by-class" className="space-y-6">
            <div className="grid gap-6">
              {Object.entries(
                bookings.reduce((acc, booking) => {
                  if (!acc[booking.className]) {
                    acc[booking.className] = [];
                  }
                  acc[booking.className].push(booking);
                  return acc;
                }, {} as Record<string, ClassBooking[]>)
              ).map(([className, classBookings]) => (
                <Card key={className}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{className}</span>
                      <Badge variant="secondary">
                        {classBookings.length} {classBookings.length === 1 ? 'student' : 'students'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {classBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{booking.studentName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <a href={`mailto:${booking.studentEmail}`} className="hover:text-primary">
                                {booking.studentEmail}
                              </a>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="text-sm font-medium">{booking.date}</div>
                            <div className="text-sm text-muted-foreground">{booking.time}</div>
                            <Badge variant={booking.amount > 0 ? "default" : "secondary"} className="text-xs">
                              {booking.paymentMethod}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="email-test" className="space-y-6">
            <ResendTest />
          </TabsContent>

          <TabsContent value="zoom-test" className="space-y-6">
            <ZoomTest />
          </TabsContent>

          <TabsContent value="zoom-debug" className="space-y-6">
            <ZoomDebugTest />
          </TabsContent>

          <TabsContent value="booking-test" className="space-y-6">
            <BookingTest />
          </TabsContent>

          <TabsContent value="database-test" className="space-y-6">
            <DatabaseTest />
          </TabsContent>

          <TabsContent value="payment-test" className="space-y-6">
            <TestPayment />
          </TabsContent>

          <TabsContent value="database-setup" className="space-y-6">
            <DatabaseSetup />
          </TabsContent>
        </Tabs>

        {/* Admin Note */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="mb-2">Admin Notes</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📧 <strong>Email Notifications:</strong> All bookings automatically send notifications to nirvayogastudio@gmail.com</p>
              <p>🔄 <strong>Real-time Updates:</strong> New bookings appear instantly in this dashboard</p>
              <p>📊 <strong>Payment Tracking:</strong> Monitor both paid classes and class pack usage</p>
              <p>🎥 <strong>Zoom Integration:</strong> Each class gets a unique Zoom meeting with shared link</p>
              <p>⚠️ <strong>Production Note:</strong> Connect to a real payment processor and email service for live environment</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}