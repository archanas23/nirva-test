import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Clock, Users, BookOpen } from "lucide-react";

interface ClassItem {
  id: string;
  time: string;
  className: string;
  teacher: string;
  duration: string;
  level: string;
  registrationClosed?: boolean;
  maxStudents?: number;
  currentEnrollment?: number;
}

interface ClassScheduleProps {
  onBookClass?: (classItem: ClassItem, day: string) => void;
  user?: {
    email: string;
    name?: string;
    classPacks: {
      fivePack: number;
      tenPack: number;
    };
  } | null;
}

export function ClassSchedule({ onBookClass, user }: ClassScheduleProps) {
  const totalClasses = user ? user.classPacks.fivePack + user.classPacks.tenPack : 0;
  const canBook = totalClasses > 0;

  // Monthly schedule starting fresh from Monday, September 9th, 2025
  // All classes standardized to 60 minutes with unique Zoom meetings per session
  const monthlySchedule: { [date: string]: { dayName: string; classes: ClassItem[] } } = {
    "2025-09-08": {
      dayName: "Sun",
      classes: [
        { 
          id: "1", 
          time: "9:00 am", 
          className: "Sunday Restore", 
          teacher: "Harshada", 
          duration: "60 min", 
          level: "All Levels",
          registrationClosed: false,
          maxStudents: 10,
          currentEnrollment: 0
        },
        { 
          id: "2", 
          time: "5:00 pm", 
          className: "Sunset Flow", 
          teacher: "Archana", 
          duration: "60 min", 
          level: "All Levels",
          registrationClosed: false,
          maxStudents: 10,
          currentEnrollment: 0
        }
      ]
    },
    "2025-09-09": {
      dayName: "Mon",
      classes: [
        { 
          id: "3", 
          time: "8:00 am", 
          className: "Morning Flow", 
          teacher: "Harshada", 
          duration: "60 min", 
          level: "All Levels",
          registrationClosed: false,
          maxStudents: 10,
          currentEnrollment: 0
        },
        { 
          id: "4", 
          time: "6:00 pm", 
          className: "Evening Restore", 
          teacher: "Archana", 
          duration: "60 min", 
          level: "All Levels",
          registrationClosed: false,
          maxStudents: 10,
          currentEnrollment: 0
        }
      ]
    },
    "2025-09-10": {
      dayName: "Tue",
      classes: [
        { 
          id: "5", 
          time: "8:00 am", 
          className: "Morning Flow", 
          teacher: "Harshada", 
          duration: "60 min", 
          level: "All Levels",
          registrationClosed: false,
          maxStudents: 10,
          currentEnrollment: 0
        },
        { 
          id: "6", 
          time: "6:00 pm", 
          className: "Evening Restore", 
          teacher: "Archana", 
          duration: "60 min", 
          level: "All Levels",
          registrationClosed: false,
          maxStudents: 10,
          currentEnrollment: 0
        }
      ]
    },
    "2025-09-11": {
      dayName: "Wed",
      classes: [
        { 
          id: "7", 
          time: "8:00 am", 
          className: "Morning Flow", 
          teacher: "Harshada", 
          duration: "60 min", 
          level: "All Levels",
          registrationClosed: false,
          maxStudents: 10,
          currentEnrollment: 0
        },
        { 
          id: "8", 
          time: "6:00 pm", 
          className: "Evening Restore", 
          teacher: "Archana", 
          duration: "60 min", 
          level: "All Levels",
          registrationClosed: false,
          maxStudents: 10,
          currentEnrollment: 0
        }
      ]
    },
    "2025-09-12": {
      dayName: "Thu",
      classes: [
        { 
          id: "9", 
          time: "8:00 am", 
          className: "Morning Flow", 
          teacher: "Harshada", 
          duration: "60 min", 
          level: "All Levels",
          registrationClosed: false,
          maxStudents: 10,
          currentEnrollment: 0
        },
        { 
          id: "10", 
          time: "6:00 pm", 
          className: "Evening Restore", 
          teacher: "Archana", 
          duration: "60 min", 
          level: "All Levels",
          registrationClosed: false,
          maxStudents: 10,
          currentEnrollment: 0
        }
      ]
    },
    "2025-09-13": {
      dayName: "Fri",
      classes: [
        { 
          id: "11", 
          time: "8:00 am", 
          className: "Morning Flow", 
          teacher: "Harshada", 
          duration: "60 min", 
          level: "All Levels",
          registrationClosed: false,
          maxStudents: 10,
          currentEnrollment: 0
        },
        { 
          id: "12", 
          time: "6:00 pm", 
          className: "Evening Restore", 
          teacher: "Archana", 
          duration: "60 min", 
          level: "All Levels",
          registrationClosed: false,
          maxStudents: 10,
          currentEnrollment: 0
        }
      ]
    },
    "2025-09-14": {
      dayName: "Sat",
      classes: [
        { 
          id: "13", 
          time: "9:00 am", 
          className: "Saturday Flow", 
          teacher: "Harshada", 
          duration: "60 min", 
          level: "All Levels",
          registrationClosed: false,
          maxStudents: 10,
          currentEnrollment: 0
        },
        { 
          id: "14", 
          time: "5:00 pm", 
          className: "Weekend Restore", 
          teacher: "Archana", 
          duration: "60 min", 
          level: "All Levels",
          registrationClosed: false,
          maxStudents: 10,
          currentEnrollment: 0
        }
      ]
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div className="space-y-6">
      {/* Header with Package Info */}
      <div className="text-center">
        <h2 className="text-3xl font-heading mb-2">Class Schedule</h2>
        <p className="text-muted-foreground mb-4">
          All classes are 60 minutes via Zoom • Maximum 10 students per class
        </p>
        
        {user && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="font-semibold text-primary">Your Classes</span>
            </div>
            <p className="text-2xl font-bold text-primary">{totalClasses}</p>
            <p className="text-sm text-muted-foreground">
              {totalClasses > 0 ? 'classes remaining' : 'No classes remaining'}
            </p>
            {totalClasses === 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Purchase packages to start booking
              </p>
            )}
          </div>
        )}
      </div>

      {/* Schedule Grid */}
      <div className="grid gap-4">
        {Object.entries(monthlySchedule).map(([date, dayData]) => (
          <div key={date} className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-lg">
                {getDayName(date)} - {formatDate(date)}
              </h3>
            </div>
            
            <div className="grid gap-3">
              {dayData.classes.map((classItem) => (
                <div key={classItem.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{classItem.className}</h4>
                      <Badge variant="outline" className="text-xs">
                        {classItem.level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {classItem.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {classItem.teacher}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {classItem.duration}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {classItem.registrationClosed ? (
                      <Badge variant="secondary">Registration Closed</Badge>
                    ) : !user ? (
                      <Button 
                        onClick={() => onBookClass?.(classItem, formatDate(date))}
                        size="sm"
                        variant="outline"
                      >
                        Login to Book
                      </Button>
                    ) : !canBook ? (
                      <Button 
                        onClick={() => onBookClass?.(classItem, formatDate(date))}
                        size="sm"
                        variant="outline"
                      >
                        Pay $11
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => onBookClass?.(classItem, formatDate(date))}
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                      >
                        Book (Free)
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Package Purchase CTA */}
      {user && totalClasses === 0 && (
        <div className="text-center bg-muted/50 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2">Ready to Start Your Practice?</h3>
          <p className="text-muted-foreground mb-4">
            Purchase class packages to book unlimited classes
          </p>
          <Button 
            onClick={() => onBookClass?.({} as ClassItem, '')}
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            View Packages
          </Button>
        </div>
      )}
    </div>
  );
}