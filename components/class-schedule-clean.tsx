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
      duration: instance.class?.duration || '60 min',
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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">CLASS SCHEDULE</h2>
        <p className="text-gray-600 mb-4">Book your yoga classes for the week. Only classes created by admin will appear here.</p>
        
        {/* Week Navigation */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeekOffset(prev => prev - 1)}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Week
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeekOffset(0)}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            This Week
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeekOffset(prev => prev + 1)}
            className="flex items-center gap-2"
          >
            Next Week
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Welcome Message */}
      {user && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 text-center">
          <p className="text-amber-800 font-medium">
            Welcome back, {user.name || user.email}! You have {user.classPacks?.singleClasses + user.classPacks?.fivePack + user.classPacks?.tenPack || 0} classes remaining.
          </p>
        </div>
      )}

      {/* Weekly Schedule - List Format */}
      <div className="space-y-4">
        {getCurrentWeekDates().map((date, index) => {
          const futureClasses = getFutureClassesForDate(date);
          
          return (
            <div key={date.toISOString()} className="bg-white rounded-lg border border-gray-200 p-4">
              {/* Day Header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {date.toLocaleDateString('en-US', { weekday: 'long' })}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {futureClasses.length} class{futureClasses.length !== 1 ? 'es' : ''}
                </div>
              </div>

              {/* Classes for this day */}
              {futureClasses.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">No classes scheduled</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {futureClasses.map((classItem) => {
                    const isPast = isClassInPast(date, classItem.time);
                    const isBooked = isClassBooked?.(classItem.id);
                    
                    // Debug logging
                    console.log('🔍 Class Item ID:', classItem.id);
                    console.log('🔍 Is Booked:', isBooked);
                    console.log('🔍 Booked Classes:', bookedClasses);
                    
                    // Create the same key format as in App.tsx
                    // Convert time format to match booking format
                    const formatTimeForKey = (timeStr: string) => {
                      if (!timeStr) return '00:00';
                      const [hours, minutes] = timeStr.split(':');
                      const hour = parseInt(hours);
                      const ampm = hour >= 12 ? 'PM' : 'AM';
                      const displayHour = hour % 12 || 12;
                      return `${displayHour}:${minutes} ${ampm}`;
                    };
                    
                    const classKey = `${classItem.name}-${date.toISOString().split('T')[0]}-${formatTimeForKey(classItem.time)}`;
                    console.log('🔍 Class Key:', classKey);
                    console.log('🔍 Zoom Link for this class:', bookedClasses[classKey]?.zoomLink);
                    
                    return (
                      <div key={classItem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <div className="text-lg font-semibold text-gray-900 min-w-[80px]">
                              {classItem.time}
                            </div>
                            <div className="text-lg font-medium text-gray-800">
                              {classItem.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {classItem.teacher}
                            </div>
                            <div className="text-sm text-gray-500">
                              {classItem.level} • {classItem.duration}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0 ml-4">
                          {isPast ? (
                            <Badge variant="secondary">Past Class</Badge>
                          ) : classItem.registrationClosed ? (
                            <Badge variant="secondary">Registration Closed</Badge>
                          ) : isBooked ? (
                            <div className="flex items-center gap-2">
                              <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                                ✅ Booked
                              </Badge>
                              {bookedClasses[classKey]?.zoomLink && (
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                  onClick={() => window.open(bookedClasses[classKey].zoomLink, '_blank')}
                                >
                                  🔗 Join Zoom
                                </Button>
                              )}
                              <Button 
                                size="sm"
                                variant="destructive"
                                className="text-xs"
                                onClick={() => onCancelClass?.(classItem.id || '')}
                                disabled={isPast}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              onClick={async () => await onBookClass?.(classItem, formatDate(date))}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              disabled={isPast}
                            >
                              Book Class
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
