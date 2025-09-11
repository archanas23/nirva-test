import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Clock, Users, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { ClassManagementService, ClassInstance, Class } from '../utils/class-management';

interface ClassItem {
  id: string;
  name: string;
  teacher: string;
  time: string;
  duration: string;
  level: string;
  maxStudents: number;
  registrationClosed?: boolean;
}

interface FullYearCalendarProps {
  onBookClass?: (classItem: ClassItem, day: string) => void;
  onCancelClass?: (classId: string) => void;
  onPayForClass?: (classItem: ClassItem, day: string) => void;
  user?: any;
  bookedClasses?: { [key: string]: any };
  isClassBooked?: (classId: string) => boolean;
}

export function FullYearCalendar({ 
  onBookClass, 
  onCancelClass, 
  onPayForClass, 
  user, 
  bookedClasses = {}, 
  isClassBooked 
}: FullYearCalendarProps) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [classes, setClasses] = useState<Class[]>([]);
  const [classInstances, setClassInstances] = useState<ClassInstance[]>([]);
  const [loading, setLoading] = useState(true);

  // Load classes and instances
  useEffect(() => {
    loadData();
  }, [currentYear, currentMonth]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load classes and instances for the current month
      const [classesData, instancesData] = await Promise.all([
        ClassManagementService.getClasses(),
        ClassManagementService.getClassInstances(
          new Date(currentYear, currentMonth, 1).toISOString().split('T')[0],
          new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0]
        )
      ]);
      
      setClasses(classesData);
      setClassInstances(instancesData);
    } catch (error) {
      console.error('Error loading calendar data:', error);
      // Fallback to generated classes
      setClasses([]);
      setClassInstances([]);
    } finally {
      setLoading(false);
    }
  };

  // Generate classes for a specific date based on class templates
  const generateClassesForDate = (date: Date): ClassItem[] => {
    const dayOfWeek = date.getDay();
    const generatedClasses: ClassItem[] = [];

    // Use database classes if available, otherwise use fallback
    const activeClasses = classes.length > 0 ? classes : getFallbackClasses();

    activeClasses.forEach((cls) => {
      if (cls.day_of_week === dayOfWeek && cls.is_active) {
        generatedClasses.push({
          id: `${cls.name.toLowerCase().replace(/\s+/g, '-')}-${date.toISOString().split('T')[0]}`,
          name: cls.name,
          teacher: cls.teacher,
          time: cls.start_time,
          duration: cls.duration,
          level: cls.level,
          maxStudents: cls.max_students,
          registrationClosed: false
        });
      }
    });

    return generatedClasses;
  };

  // Fallback classes when database is not available
  const getFallbackClasses = (): Class[] => {
    return [
      {
        id: '1',
        name: 'Morning Flow',
        teacher: 'Harshada',
        day_of_week: 1, // Monday
        start_time: '08:00',
        duration: '60 min',
        level: 'All Levels',
        max_students: 10,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Evening Restore',
        teacher: 'Archana',
        day_of_week: 1, // Monday
        start_time: '18:00',
        duration: '60 min',
        level: 'All Levels',
        max_students: 10,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Morning Flow',
        teacher: 'Harshada',
        day_of_week: 2, // Tuesday
        start_time: '08:00',
        duration: '60 min',
        level: 'All Levels',
        max_students: 10,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Evening Restore',
        teacher: 'Archana',
        day_of_week: 2, // Tuesday
        start_time: '18:00',
        duration: '60 min',
        level: 'All Levels',
        max_students: 10,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Morning Flow',
        teacher: 'Harshada',
        day_of_week: 3, // Wednesday
        start_time: '08:00',
        duration: '60 min',
        level: 'All Levels',
        max_students: 10,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '6',
        name: 'Evening Restore',
        teacher: 'Archana',
        day_of_week: 3, // Wednesday
        start_time: '18:00',
        duration: '60 min',
        level: 'All Levels',
        max_students: 10,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '7',
        name: 'Morning Flow',
        teacher: 'Harshada',
        day_of_week: 4, // Thursday
        start_time: '08:00',
        duration: '60 min',
        level: 'All Levels',
        max_students: 10,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '8',
        name: 'Evening Restore',
        teacher: 'Archana',
        day_of_week: 4, // Thursday
        start_time: '18:00',
        duration: '60 min',
        level: 'All Levels',
        max_students: 10,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '9',
        name: 'Morning Flow',
        teacher: 'Harshada',
        day_of_week: 5, // Friday
        start_time: '08:00',
        duration: '60 min',
        level: 'All Levels',
        max_students: 10,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '10',
        name: 'Evening Restore',
        teacher: 'Archana',
        day_of_week: 5, // Friday
        start_time: '18:00',
        duration: '60 min',
        level: 'All Levels',
        max_students: 10,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '11',
        name: 'Saturday Flow',
        teacher: 'Harshada',
        day_of_week: 6, // Saturday
        start_time: '09:00',
        duration: '60 min',
        level: 'All Levels',
        max_students: 10,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '12',
        name: 'Weekend Restore',
        teacher: 'Archana',
        day_of_week: 6, // Saturday
        start_time: '17:00',
        duration: '60 min',
        level: 'All Levels',
        max_students: 10,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '13',
        name: 'Sunday Restore',
        teacher: 'Harshada',
        day_of_week: 0, // Sunday
        start_time: '09:00',
        duration: '60 min',
        level: 'All Levels',
        max_students: 10,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '14',
        name: 'Sunset Flow',
        teacher: 'Archana',
        day_of_week: 0, // Sunday
        start_time: '17:00',
        duration: '60 min',
        level: 'All Levels',
        max_students: 10,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  };

  // Check if a class is in the past
  const isClassInPast = (classDate: Date, classTime: string): boolean => {
    const now = new Date();
    const timeStr = classTime.toLowerCase().replace(/\s/g, '');
    const isPM = timeStr.includes('pm');
    const timeOnly = timeStr.replace(/[ap]m/, '');
    const [hoursStr, minutesStr] = timeOnly.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = minutesStr ? parseInt(minutesStr, 10) : 0;
    
    let hour24 = hours;
    if (isPM && hours !== 12) hour24 += 12;
    if (!isPM && hours === 12) hour24 = 0;
    
    const classDateTime = new Date(classDate.getFullYear(), classDate.getMonth(), classDate.getDate(), hour24, minutes, 0, 0);
    const bufferTime = new Date(classDateTime.getTime() + 30 * 60 * 1000);
    
    return now > bufferTime;
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const goToCurrentMonth = () => {
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
  };

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentYear, currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <CalendarIcon className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-heading">
            {monthNames[currentMonth]} {currentYear}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={goToPreviousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={goToCurrentMonth}>
            Today
          </Button>
          <Button variant="outline" onClick={goToNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={index} className="h-32"></div>;
          }

          const classesForDate = generateClassesForDate(date);
          const isToday = date.toDateString() === new Date().toDateString();
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const isPast = date < today;

          return (
            <Card key={index} className={`h-32 ${isToday ? 'ring-2 ring-primary' : ''} ${isPast ? 'opacity-50' : ''}`}>
              <CardContent className="p-2 h-full">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${isToday ? 'text-primary' : ''}`}>
                      {date.getDate()}
                    </span>
                    {isToday && (
                      <Badge variant="secondary" className="text-xs">
                        Today
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    {classesForDate.map((classItem) => {
                      const isPast = isClassInPast(date, classItem.time);
                      const isBooked = isClassBooked?.(classItem.id);
                      
                      return (
                        <div key={classItem.id} className="mb-1">
                          <div className="text-xs text-muted-foreground truncate">
                            {formatTime(classItem.time)} - {classItem.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {classItem.teacher}
                          </div>
                          {isBooked && (
                            <Badge variant="default" className="text-xs bg-green-600">
                              Booked
                            </Badge>
                          )}
                          {isPast && (
                            <Badge variant="secondary" className="text-xs">
                              Past
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Class Details for Selected Date */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Class Schedule</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 7 }, (_, i) => {
            const date = new Date(currentYear, currentMonth, i + 1);
            const classesForDate = generateClassesForDate(date);
            
            if (classesForDate.length === 0) return null;
            
            return (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {formatDate(date)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {classesForDate.map((classItem) => {
                    const isPast = isClassInPast(date, classItem.time);
                    const isBooked = isClassBooked?.(classItem.id);
                    
                    return (
                      <div key={classItem.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{classItem.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatTime(classItem.time)} • {classItem.teacher} • {classItem.level}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isPast ? (
                            <Badge variant="secondary">Past Class</Badge>
                          ) : isBooked ? (
                            <Badge variant="default" className="bg-green-600">
                              ✅ Booked
                            </Badge>
                          ) : !user ? (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => onBookClass?.(classItem, formatDate(date))}
                            >
                              Login to Book
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              className="bg-primary hover:bg-primary/90"
                              onClick={() => onBookClass?.(classItem, formatDate(date))}
                            >
                              Book Class
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          }).filter(Boolean)}
        </div>
      </div>
    </div>
  );
}
