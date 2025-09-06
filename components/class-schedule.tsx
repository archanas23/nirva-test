import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

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
}

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
        time: "7:30 am", 
        className: "Power Yoga", 
        teacher: "Archana", 
        duration: "60 min", 
        level: "Advanced",
        registrationClosed: false,
        maxStudents: 10,
        currentEnrollment: 0
      },
      { 
        id: "4", 
        time: "6:30 pm", 
        className: "Gentle Hatha", 
        teacher: "Harshada", 
        duration: "60 min", 
        level: "Beginner",
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
        time: "6:30 pm", 
        className: "Vinyasa Flow", 
        teacher: "Archana", 
        duration: "60 min", 
        level: "Intermediate",
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
        id: "6", 
        time: "7:00 am", 
        className: "Morning Flow", 
        teacher: "Harshada", 
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
        id: "7", 
        time: "6:00 pm", 
        className: "Slow Flow", 
        teacher: "Harshada", 
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
        id: "8", 
        time: "7:30 am", 
        className: "Power Yoga", 
        teacher: "Archana", 
        duration: "60 min", 
        level: "Advanced",
        registrationClosed: false,
        maxStudents: 10,
        currentEnrollment: 0
      },
      { 
        id: "9", 
        time: "6:00 pm", 
        className: "Vinyasa Flow", 
        teacher: "Archana", 
        duration: "60 min", 
        level: "Intermediate",
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
        id: "10", 
        time: "9:00 am", 
        className: "Morning Gentle", 
        teacher: "Harshada", 
        duration: "60 min", 
        level: "Beginner",
        registrationClosed: false,
        maxStudents: 10,
        currentEnrollment: 0
      }
    ]
  },
  "2025-09-15": {
    dayName: "Sun",
    classes: [
      { 
        id: "11", 
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
        id: "12", 
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
  "2025-09-16": {
    dayName: "Mon",
    classes: [
      { 
        id: "13", 
        time: "7:30 am", 
        className: "Power Yoga", 
        teacher: "Archana", 
        duration: "60 min", 
        level: "Advanced",
        registrationClosed: false,
        maxStudents: 10,
        currentEnrollment: 0
      },
      { 
        id: "14", 
        time: "6:30 pm", 
        className: "Gentle Hatha", 
        teacher: "Harshada", 
        duration: "60 min", 
        level: "Beginner",
        registrationClosed: false,
        maxStudents: 10,
        currentEnrollment: 0
      }
    ]
  },
  "2025-09-17": {
    dayName: "Tue",
    classes: [
      { 
        id: "15", 
        time: "6:30 pm", 
        className: "Vinyasa Flow", 
        teacher: "Archana", 
        duration: "60 min", 
        level: "Intermediate",
        registrationClosed: false,
        maxStudents: 10,
        currentEnrollment: 0
      }
    ]
  },
  "2025-09-18": {
    dayName: "Wed",
    classes: [
      { 
        id: "16", 
        time: "7:00 am", 
        className: "Morning Flow", 
        teacher: "Harshada", 
        duration: "60 min", 
        level: "All Levels",
        registrationClosed: false,
        maxStudents: 10,
        currentEnrollment: 0
      }
    ]
  },
  "2025-09-19": {
    dayName: "Thu",
    classes: [
      { 
        id: "17", 
        time: "6:00 pm", 
        className: "Slow Flow", 
        teacher: "Harshada", 
        duration: "60 min", 
        level: "All Levels",
        registrationClosed: false,
        maxStudents: 10,
        currentEnrollment: 0
      }
    ]
  },
  "2025-09-20": {
    dayName: "Fri",
    classes: [
      { 
        id: "18", 
        time: "7:30 am", 
        className: "Power Yoga", 
        teacher: "Archana", 
        duration: "60 min", 
        level: "Advanced",
        registrationClosed: false,
        maxStudents: 10,
        currentEnrollment: 0
      },
      { 
        id: "19", 
        time: "6:00 pm", 
        className: "Vinyasa Flow", 
        teacher: "Archana", 
        duration: "60 min", 
        level: "Intermediate",
        registrationClosed: false,
        maxStudents: 10,
        currentEnrollment: 0
      }
    ]
  },
  "2025-09-21": {
    dayName: "Sat",
    classes: [
      { 
        id: "20", 
        time: "9:00 am", 
        className: "Morning Gentle", 
        teacher: "Harshada", 
        duration: "60 min", 
        level: "Beginner",
        registrationClosed: false,
        maxStudents: 10,
        currentEnrollment: 0
      }
    ]
  },
  "2025-09-22": {
    dayName: "Sun",
    classes: [
      { 
        id: "21", 
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
        id: "22", 
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
  "2025-09-23": {
    dayName: "Mon",
    classes: [
      { 
        id: "23", 
        time: "7:30 am", 
        className: "Power Yoga", 
        teacher: "Archana", 
        duration: "60 min", 
        level: "Advanced",
        registrationClosed: false,
        maxStudents: 10,
        currentEnrollment: 0
      },
      { 
        id: "24", 
        time: "6:30 pm", 
        className: "Gentle Hatha", 
        teacher: "Harshada", 
        duration: "60 min", 
        level: "Beginner",
        registrationClosed: false,
        maxStudents: 10,
        currentEnrollment: 0
      }
    ]
  },
  "2025-09-24": {
    dayName: "Tue",
    classes: [
      { 
        id: "25", 
        time: "6:30 pm", 
        className: "Vinyasa Flow", 
        teacher: "Archana", 
        duration: "60 min", 
        level: "Intermediate",
        registrationClosed: false,
        maxStudents: 10,
        currentEnrollment: 0
      }
    ]
  },
  "2025-09-25": {
    dayName: "Wed",
    classes: [
      { 
        id: "26", 
        time: "7:00 am", 
        className: "Morning Flow", 
        teacher: "Harshada", 
        duration: "60 min", 
        level: "All Levels",
        registrationClosed: false,
        maxStudents: 10,
        currentEnrollment: 0
      }
    ]
  },
  "2025-09-26": {
    dayName: "Thu",
    classes: [
      { 
        id: "27", 
        time: "6:00 pm", 
        className: "Slow Flow", 
        teacher: "Harshada", 
        duration: "60 min", 
        level: "All Levels",
        registrationClosed: false,
        maxStudents: 10,
        currentEnrollment: 0
      }
    ]
  },
  "2025-09-27": {
    dayName: "Fri",
    classes: [
      { 
        id: "28", 
        time: "7:30 am", 
        className: "Power Yoga", 
        teacher: "Archana", 
        duration: "60 min", 
        level: "Advanced",
        registrationClosed: false,
        maxStudents: 10,
        currentEnrollment: 0
      },
      { 
        id: "29", 
        time: "6:00 pm", 
        className: "Vinyasa Flow", 
        teacher: "Archana", 
        duration: "60 min", 
        level: "Intermediate",
        registrationClosed: false,
        maxStudents: 10,
        currentEnrollment: 0
      }
    ]
  },
  "2025-09-28": {
    dayName: "Sat",
    classes: [
      { 
        id: "30", 
        time: "9:00 am", 
        className: "Morning Gentle", 
        teacher: "Harshada", 
        duration: "60 min", 
        level: "Beginner",
        registrationClosed: false,
        maxStudents: 10,
        currentEnrollment: 0
      }
    ]
  },
  "2025-09-29": {
    dayName: "Sun",
    classes: [
      { 
        id: "31", 
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
        id: "32", 
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
  "2025-09-30": {
    dayName: "Mon",
    classes: [
      { 
        id: "33", 
        time: "7:30 am", 
        className: "Power Yoga", 
        teacher: "Archana", 
        duration: "60 min", 
        level: "Advanced",
        registrationClosed: false,
        maxStudents: 10,
        currentEnrollment: 0
      },
      { 
        id: "34", 
        time: "6:30 pm", 
        className: "Gentle Hatha", 
        teacher: "Harshada", 
        duration: "60 min", 
        level: "Beginner",
        registrationClosed: false,
        maxStudents: 10,
        currentEnrollment: 0
      }
    ]
  }
};

function formatDate(dateString: string): { dayNumber: string; fullDate: string } {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return {
    dayNumber: date.getDate().toString(),
    fullDate: date.toLocaleDateString('en-US', options)
  };
}

export function ClassSchedule({ onBookClass }: ClassScheduleProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="mb-4">Class Schedule</h2>
        <p className="text-primary mb-2">September 2025</p>
        <p className="text-muted-foreground mb-2">All Zoom classes are $10/class • Practiced from your home</p>
        <p className="text-muted-foreground">Drop-in friendly • No membership required • Zoom link sent after booking</p>
      </div>
      
      <div className="space-y-6">
        {Object.entries(monthlySchedule).map(([dateString, dayData]) => {
          const { dayNumber, fullDate } = formatDate(dateString);
          const hasClasses = dayData.classes.length > 0;
          
          return (
            <div key={dateString} className="border rounded-lg p-6 bg-card">
              {/* Date Header */}
              <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-medium">{dayData.dayName}</div>
                  <div className="text-4xl font-medium text-primary">{dayNumber}</div>
                </div>
                <div className="text-muted-foreground">{fullDate}</div>
              </div>
              
              {/* Classes or No Classes Message */}
              {hasClasses ? (
                <div className="space-y-4">
                  {dayData.classes.map((classItem) => (
                    <div key={classItem.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-accent/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className="font-medium text-lg">{classItem.time}</span>
                          <span className="text-xl">{classItem.className}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                          <span>{classItem.teacher}</span>
                          <span>•</span>
                          <span>{classItem.duration}</span>
                          <span>•</span>
                          <span>{classItem.level}</span>
                          {classItem.maxStudents && classItem.currentEnrollment !== undefined && (
                            <>
                              <span>•</span>
                              <span className={classItem.currentEnrollment >= classItem.maxStudents ? "text-destructive" : ""}>
                                {classItem.currentEnrollment}/{classItem.maxStudents} spots
                              </span>
                            </>
                          )}
                          {classItem.registrationClosed && (
                            <>
                              <span>•</span>
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                Registration closed
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {onBookClass && (
                          <Button 
                            size="sm" 
                            onClick={() => onBookClass(classItem, `${dayData.dayName} ${dayNumber}`)}
                            disabled={classItem.registrationClosed || (classItem.currentEnrollment !== undefined && classItem.maxStudents !== undefined && classItem.currentEnrollment >= classItem.maxStudents)}
                            className="w-full sm:w-auto"
                            variant={(classItem.registrationClosed || (classItem.currentEnrollment !== undefined && classItem.maxStudents !== undefined && classItem.currentEnrollment >= classItem.maxStudents)) ? "outline" : "default"}
                          >
                            {(classItem.currentEnrollment !== undefined && classItem.maxStudents !== undefined && classItem.currentEnrollment >= classItem.maxStudents) ? "Full" : "Book"}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <p className="text-lg">No available slots on {fullDate}</p>
                  <p className="text-sm mt-1">No classes</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}