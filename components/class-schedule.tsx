import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Clock, Users, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { ClassManagementService, ClassInstance } from "../utils/class-management";

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
  onBookClass?: (classItem: ClassItem, day: string) => Promise<void>;
  onCancelClass?: (classId: string) => Promise<void>;
  onPayForClass?: (classItem: ClassItem, day: string) => void;
  user?: {
    email: string;
    name?: string;
    classPacks: {
      singleClasses: number;
      fivePack: number;
      tenPack: number;
    };
  } | null;
  bookedClasses?: {
    [classId: string]: {
      className: string;
      teacher: string;
      time: string;
      day: string;
      zoomLink?: string;
      zoomPassword?: string;
      meetingId?: string;
      bookedAt: string;
    };
  };
  isClassBooked?: (classId: string) => boolean;
}

export function ClassSchedule({ onBookClass, onCancelClass, onPayForClass, user, bookedClasses = {}, isClassBooked }: ClassScheduleProps) {
  const totalClasses = user ? user.classPacks.singleClasses + user.classPacks.fivePack + user.classPacks.tenPack : 0;
  const canBook = totalClasses > 0;
  
  // State for calendar navigation and data
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [classInstances, setClassInstances] = useState<ClassInstance[]>([]);
  const [loading, setLoading] = useState(true);

  // Load class instances for the current week
  useEffect(() => {
    const loadClassInstances = async () => {
      try {
        setLoading(true);
        const weekDates = getCurrentWeekDates();
        const startDate = weekDates[0].toISOString().split('T')[0];
        const endDate = weekDates[6].toISOString().split('T')[0];
        
        const instances = await ClassManagementService.getClassInstances(startDate, endDate);
        setClassInstances(instances);
      } catch (error) {
        console.error('Error loading class instances:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClassInstances();
  }, [currentWeekOffset]);

  // Convert ClassInstance to ClassItem format
  const convertToClassItem = (instance: ClassInstance): ClassItem => {
    const time = instance.class?.start_time || '00:00';
    const timeFormatted = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return {
      id: instance.id,
      time: timeFormatted,
      className: instance.class?.name || 'Unknown Class',
      teacher: instance.class?.teacher || 'Unknown Teacher',
      duration: `${instance.class?.duration || 60} min`,
      level: instance.class?.level || 'All Levels',
      registrationClosed: false,
      maxStudents: instance.class?.max_students || 10,
      currentEnrollment: 0
    };
  };

  // Generate a week of dates starting from a given date
  const generateWeekDates = (startDate: Date): Date[] => {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Get the current week's dates (September 2025 only)
  const getCurrentWeekDates = (): Date[] => {
    const september2025 = new Date(2025, 8, 7); // September 7, 2025 (month is 0-indexed)
    
    // Calculate the start of the current week in September
    const startOfWeek = new Date(september2025);
    startOfWeek.setDate(september2025.getDate() - september2025.getDay() + (currentWeekOffset * 7));
    
    // Ensure we don't go beyond September 2025
    if (startOfWeek.getMonth() !== 8) { // September is month 8 (0-indexed)
      startOfWeek.setMonth(8, 1); // Reset to September 1st
    }
    
    return generateWeekDates(startOfWeek);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Generate fallback classes for a given date (when no Supabase data)
  const generateFallbackClassesForDate = (date: Date): ClassItem[] => {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const classes: ClassItem[] = [];
    
    // Sunday classes
    if (dayOfWeek === 0) {
      classes.push(
        { 
          id: `sun-morning-${date.toISOString().split('T')[0]}`, 
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
          id: `sun-evening-${date.toISOString().split('T')[0]}`, 
          time: "5:00 pm", 
          className: "Sunset Flow", 
          teacher: "Archana", 
          duration: "60 min", 
          level: "All Levels",
          registrationClosed: false,
          maxStudents: 10,
          currentEnrollment: 0
        }
      );
    }
    // Monday-Friday classes
    else if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      classes.push(
        { 
          id: `weekday-morning-${date.toISOString().split('T')[0]}`, 
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
          id: `weekday-evening-${date.toISOString().split('T')[0]}`, 
          time: "6:00 pm", 
          className: "Evening Restore", 
          teacher: "Archana", 
          duration: "60 min", 
          level: "All Levels",
          registrationClosed: false,
          maxStudents: 10,
          currentEnrollment: 0
        }
      );
    }
    // Saturday classes
    else if (dayOfWeek === 6) {
      classes.push(
        { 
          id: `sat-morning-${date.toISOString().split('T')[0]}`, 
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
          id: `sat-evening-${date.toISOString().split('T')[0]}`, 
          time: "5:00 pm", 
          className: "Weekend Restore", 
          teacher: "Archana", 
          duration: "60 min", 
          level: "All Levels",
          registrationClosed: false,
          maxStudents: 10,
          currentEnrollment: 0
        }
      );
    }
    
    return classes;
  };

  // Get classes for a given date (with fallback to generated classes)
  const getFutureClassesForDate = (date: Date): ClassItem[] => {
    const dateStr = date.toISOString().split('T')[0];
    
    // Get class instances for this specific date
    const instancesForDate = classInstances.filter(instance => 
      instance.class_date === dateStr
    );
    
    // If we have Supabase data, use it
    if (instancesForDate.length > 0) {
      return instancesForDate.map(convertToClassItem);
    }
    
    // Otherwise, use fallback generated classes
    return generateFallbackClassesForDate(date);
  };

  // Navigation functions
  const goToPreviousWeek = () => {
    setCurrentWeekOffset(prev => prev - 1);
  };

  const goToNextWeek = () => {
    setCurrentWeekOffset(prev => prev + 1);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekOffset(0);
  };

  return (
    <div className="space-y-6">
      {/* Header with Package Info */}
      <div className="text-center">
        <h2 className="text-3xl font-heading mb-2">Class Schedule</h2>
        <p className="text-muted-foreground mb-4">
          All classes are 60 minutes via Zoom • Maximum 10 students per class
        </p>
        
        {/* Private Classes Information */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-6 max-w-2xl mx-auto mb-6">
          <h3 className="text-xl font-semibold text-primary mb-2">Private Classes Available</h3>
          <p className="text-muted-foreground mb-3">
            Looking for personalized attention? Book a private one-on-one session with our certified instructors.
          </p>
          <div className="flex items-center justify-center gap-4 text-lg font-semibold">
            <span className="text-primary">$60/hour</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-foreground">Customized to your needs</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Contact us to schedule your private session
          </p>
        </div>
        
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

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousWeek}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous Week
        </Button>
        
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToCurrentWeek}
            className={currentWeekOffset === 0 ? "bg-primary text-primary-foreground" : ""}
          >
            This Week
          </Button>
          <h3 className="text-lg font-semibold">
            {(() => {
              const weekDates = getCurrentWeekDates();
              const startDate = weekDates[0];
              const endDate = weekDates[6];
              return `${formatDate(startDate)} - ${formatDate(endDate)}`;
            })()}
          </h3>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextWeek}
          className="flex items-center gap-2"
        >
          Next Week
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Schedule Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading classes...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {getCurrentWeekDates().map((date) => {
            const futureClasses = getFutureClassesForDate(date);
            
            // Only show days that have future classes
            if (futureClasses.length === 0) return null;
            
            return (
              <div key={date.toISOString()} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-lg">
                    {getDayName(date)} - {formatDate(date)}
                  </h3>
                </div>
                
                <div className="grid gap-3">
                  {futureClasses.map((classItem) => (
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
                        ) : isClassBooked?.(classItem.id) ? (
                          <div className="flex flex-col items-end gap-1">
                            <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                              ✅ Booked
                            </Badge>
                            <div className="flex gap-1">
                              {bookedClasses[classItem.id]?.zoomLink && (
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                  onClick={() => window.open(bookedClasses[classItem.id].zoomLink, '_blank')}
                                >
                                  Join Zoom
                                </Button>
                              )}
                              <Button 
                                size="sm"
                                variant="destructive"
                                className="text-xs"
                                onClick={() => onCancelClass?.(classItem.id || '')}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
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
                          onClick={() => onPayForClass?.(classItem, formatDate(date))}
                          size="sm"
                          variant="outline"
                        >
                          Pay $11
                        </Button>
                      ) : (
                        <Button 
                          onClick={async () => await onBookClass?.(classItem, formatDate(date))}
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                        >
                          Book Class
                        </Button>
                      )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

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