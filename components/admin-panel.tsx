import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Separator } from "./ui/separator";
import { Users, Calendar, DollarSign, Clock, Mail, User, Phone } from "lucide-react";

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
}

// Mock data - in production this would come from your database
const mockBookings: ClassBooking[] = [
  {
    id: "1",
    studentName: "Sarah Johnson",
    studentEmail: "sarah.j@email.com",
    className: "Morning Flow",
    teacher: "Harshada Madiraju",
    date: "September 10, 2025",
    time: "8:00 AM - 9:00 AM",
    timestamp: new Date("2025-09-05T14:30:00"),
    paymentMethod: "Credit Card",
    amount: 10.00
  },
  {
    id: "2", 
    studentName: "Mike Chen",
    studentEmail: "mike.chen@email.com",
    className: "Evening Restore",
    teacher: "Archana Soundararajan",
    date: "September 11, 2025",
    time: "7:00 PM - 8:00 PM",
    timestamp: new Date("2025-09-05T16:45:00"),
    paymentMethod: "PayPal",
    amount: 10.00
  },
  {
    id: "3",
    studentName: "Emma Davis",
    studentEmail: "emma.davis@email.com", 
    className: "Power Flow",
    teacher: "Archana Soundararajan",
    date: "September 12, 2025",
    time: "6:00 PM - 7:00 PM",
    timestamp: new Date("2025-09-05T18:20:00"),
    paymentMethod: "5-Class Pack",
    amount: 0.00
  }
];

export function AdminPanel() {
  const [bookings, setBookings] = useState<ClassBooking[]>(mockBookings);
  const [selectedClass, setSelectedClass] = useState<string>("all");

  // Listen for new bookings
  useEffect(() => {
    const handleNewBooking = (event: CustomEvent) => {
      const bookingData = event.detail;
      const newBooking: ClassBooking = {
        id: Date.now().toString(),
        timestamp: new Date(),
        paymentMethod: "Credit Card",
        amount: 10.00,
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

  // Group bookings by class
  const bookingsByClass = bookings.reduce((acc, booking) => {
    if (!acc[booking.className]) {
      acc[booking.className] = [];
    }
    acc[booking.className].push(booking);
    return acc;
  }, {} as Record<string, ClassBooking[]>);

  // Calculate statistics
  const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);
  const totalBookings = bookings.length;
  const todayBookings = bookings.filter(b => 
    new Date(b.timestamp).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2">Nirva Yoga Studio - Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage class bookings and view student enrollment
          </p>
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

        <Tabs defaultValue="all-bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all-bookings">All Bookings</TabsTrigger>
            <TabsTrigger value="by-class">By Class</TabsTrigger>
          </TabsList>

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
              {Object.entries(bookingsByClass).map(([className, classBookings]) => (
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
        </Tabs>

        {/* Admin Note */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="mb-2">Admin Notes</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📧 <strong>Email Notifications:</strong> All bookings automatically send notifications to nirvayogastudio@gmail.com</p>
              <p>🔄 <strong>Real-time Updates:</strong> New bookings appear instantly in this dashboard</p>
              <p>📊 <strong>Payment Tracking:</strong> Monitor both paid classes and class pack usage</p>
              <p>⚠️ <strong>Production Note:</strong> Connect to a real payment processor and email service for live environment</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}