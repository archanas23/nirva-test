import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChevronLeft, ChevronRight, Calendar, Clock, Users } from 'lucide-react';
import { ClassManagementService, ClassInstance } from '../utils/class-management';

interface ClassItem {
  id: string;
  name: string;
  className: string; // Add this to match App.tsx interface
  teacher: string;
  time: string;
  duration: string; // Change to string to match App.tsx interface
  level: string;
  maxStudents: number;
  registrationClosed?: boolean;
}

interface ClassScheduleProps {
  onBookClass?: (classItem: ClassItem, day: string) => void;
  onCancelClass?: (classId: string) => void;
  onPayForClass?: (classItem: ClassItem, day: string) => void;
  user?: any;
  bookedClasses?: { [key: string]: any };
  isClassBooked?: (classId: string) => boolean;
}

export function ClassSchedule({ onBookClass, onCancelClass, onPayForClass, user, bookedClasses = {}, isClassBooked }: ClassScheduleProps) {
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
        
        // Only load classes that have been explicitly created by admin
        const instances = await ClassManagementService.getClassInstances(startDate, endDate);
        setClassInstances(instances);
      } catch (error) {
        console.error('Error loading class instances:', error);
        setClassInstances([]);
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
      name: instance.class?.name || 'Unknown Class',
      className: instance.class?.name || 'Unknown Class', // Add className field
      teacher: instance.class?.teacher || 'Unknown Teacher',
      time: timeFormatted,
      duration: `${instance.class?.duration || 60} min`,
      level: instance.class?.level || 'All Levels',
      maxStudents: instance.class?.max_students || 10,
      registrationClosed: instance.is_cancelled
    };
  };

  // Get current week dates based on offset
  const getCurrentWeekDates = (): Date[] => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay + (currentWeekOffset * 7));
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    
    return weekDates;
  };

  // Get classes for a given date (only admin-created classes)
  const getFutureClassesForDate = (date: Date): ClassItem[] => {
    const dateStr = date.toISOString().split('T')[0];
    
    // Only show classes that have been explicitly created by admin
    const instancesForDate = classInstances.filter(instance => 
      instance.class_date === dateStr && !instance.is_cancelled
    );
    
    return instancesForDate.map(convertToClassItem);
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

  // Check if a class is in the past (with 30-minute buffer)
  const isClassInPast = (classDate: Date, classTime: string): boolean => {
    const now = new Date();
    
    // Parse the time (e.g., "8:00 am" or "6:00 pm")
    const timeStr = classTime.toLowerCase().replace(/\s/g, '');
    const isPM = timeStr.includes('pm');
    const timeOnly = timeStr.replace(/[ap]m/, '');
    const [hoursStr, minutesStr] = timeOnly.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = minutesStr ? parseInt(minutesStr, 10) : 0;
    
    // Convert to 24-hour format
    let hour24 = hours;
    if (isPM && hours !== 12) hour24 += 12;
    if (!isPM && hours === 12) hour24 = 0;
    
    // Create date object for the class using the same timezone
    const classDateTime = new Date(classDate.getFullYear(), classDate.getMonth(), classDate.getDate(), hour24, minutes, 0, 0);
    
    // Add 30 minutes buffer to prevent booking classes that just started
    const bufferTime = new Date(classDateTime.getTime() + 30 * 60 * 1000);
    
    const isPastResult = now > bufferTime;
    
    return isPastResult;
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

  // Get total classes available for user
  const totalClasses = user?.classPacks ? 
    (user.classPacks.singleClasses || 0) + 
    (user.classPacks.fivePack || 0) + 
    (user.classPacks.tenPack || 0) : 0;
  
  const canBook = totalClasses > 0;

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading classes...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading mb-4">Class Schedule</h2>
        <p className="text-muted-foreground mb-6">
          Book your yoga classes for the week. Only classes created by admin will appear here.
        </p>
        
        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Button variant="outline" onClick={goToPreviousWeek}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous Week
          </Button>
          <Button variant="outline" onClick={goToCurrentWeek}>
            <Calendar className="w-4 h-4 mr-2" />
            This Week
          </Button>
          <Button variant="outline" onClick={goToNextWeek}>
            Next Week
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* User info */}
        {user && (
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground">
              Welcome back, {user.name}! You have {totalClasses} class{totalClasses !== 1 ? 'es' : ''} remaining.
            </p>
          </div>
        )}
      </div>

      {/* Week View */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
        {getCurrentWeekDates().map((date) => {
          const futureClasses = getFutureClassesForDate(date);
          
          return (
            <Card key={date.toISOString()} className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {date.toLocaleDateString('en-US', { weekday: 'long' })}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {futureClasses.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No classes scheduled</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Admin needs to add classes for this day
                    </p>
                  </div>
                ) : (
                  futureClasses.map((classItem) => {
                    const isPast = isClassInPast(date, classItem.time);
                    const isBooked = isClassBooked?.(classItem.id);
                    
                    return (
                      <div key={classItem.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{classItem.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {classItem.time} • {classItem.teacher}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {classItem.level} • {classItem.duration} min
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {isPast ? (
                            <Badge variant="secondary">Past Class</Badge>
                          ) : classItem.registrationClosed ? (
                            <Badge variant="secondary">Registration Closed</Badge>
                          ) : isBooked ? (
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
                                  disabled={isPast}
                                >
                                  {isPast ? 'Past' : 'Cancel'}
                                </Button>
                              </div>
                            </div>
                          ) : !user ? (
                            <Button 
                              onClick={() => onBookClass?.(classItem, formatDate(date))}
                              size="sm"
                              variant="outline"
                              disabled={isPast}
                            >
                              {isPast ? 'Past Class' : 'Login to Book'}
                            </Button>
                          ) : !canBook ? (
                            <Button 
                              onClick={() => onPayForClass?.(classItem, formatDate(date))}
                              size="sm"
                              variant="outline"
                              disabled={isPast}
                            >
                              {isPast ? 'Past Class' : 'Book Class'}
                            </Button>
                          ) : (
                            <Button 
                              onClick={async () => await onBookClass?.(classItem, formatDate(date))}
                              size="sm"
                              className="bg-primary hover:bg-primary/90"
                              disabled={isPast}
                            >
                              {isPast ? 'Past Class' : 'Book Class'}
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Admin Notice */}
      {!user || user.email !== 'nirvayogastudio@gmail.com' ? (
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Don't see any classes? The admin needs to add classes for the upcoming weeks.
          </p>
        </div>
      ) : null}
    </div>
  );
}
