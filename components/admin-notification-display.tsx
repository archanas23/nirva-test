import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Bell, X } from "lucide-react";
import { Button } from "./ui/button";

interface AdminNotification {
  id: string;
  timestamp: Date;
  studentName: string;
  studentEmail: string;
  className: string;
  teacher: string;
  date: string;
  time: string;
}

// This would normally come from a backend/database
const mockNotifications: AdminNotification[] = [];

export function AdminNotificationDisplay() {
  const [notifications, setNotifications] = useState<AdminNotification[]>(mockNotifications);
  const [isVisible, setIsVisible] = useState(false);

  // Listen for new bookings (in a real app this would be via WebSocket or polling)
  useEffect(() => {
    const handleNewBooking = (event: CustomEvent) => {
      const bookingData = event.detail;
      const newNotification: AdminNotification = {
        id: Date.now().toString(),
        timestamp: new Date(),
        ...bookingData
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setIsVisible(true);
      
      // Auto-hide after 10 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 10000);
    };

    window.addEventListener('classBooked', handleNewBooking as EventListener);
    
    return () => {
      window.removeEventListener('classBooked', handleNewBooking as EventListener);
    };
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
    setIsVisible(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!isVisible || notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-80">
      <Alert className="border-primary/20 bg-primary/5">
        <div className="flex items-start gap-2">
          <Bell className="w-4 h-4 mt-0.5 text-primary" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-primary">New Booking!</span>
                <Badge variant="secondary" className="text-xs">
                  Admin Alert
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-auto p-1"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            
            {notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className="mb-2 last:mb-0">
                <AlertDescription className="text-sm">
                  <div className="space-y-1">
                    <p><strong>{notification.studentName}</strong> booked:</p>
                    <p className="text-xs text-muted-foreground">
                      {notification.className} • {notification.teacher}<br/>
                      {notification.date} at {notification.time}<br/>
                      <span className="text-xs opacity-75">
                        {formatTime(notification.timestamp)}
                      </span>
                    </p>
                  </div>
                </AlertDescription>
              </div>
            ))}
            
            {notifications.length > 3 && (
              <p className="text-xs text-muted-foreground mt-2">
                +{notifications.length - 3} more bookings...
              </p>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={clearNotifications}
              className="w-full mt-2 h-7 text-xs"
            >
              Clear All
            </Button>
          </div>
        </div>
      </Alert>
    </div>
  );
}