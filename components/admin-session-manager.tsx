import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Calendar, Clock, Users, Edit, Trash2, Plus, AlertCircle, CheckCircle, X } from 'lucide-react';
import { ClassManagementService, ClassInstance, Class } from '../utils/class-management';
import { ZoomService } from '../utils/zoom-service';
// Using alert for now since react-hot-toast might not be installed
const toast = {
  success: (message: string) => alert(`✅ ${message}`),
  error: (message: string) => alert(`❌ ${message}`)
};

interface AdminSessionManagerProps {
  onClose?: () => void;
}

export function AdminSessionManager({ onClose }: AdminSessionManagerProps) {
  const [sessions, setSessions] = useState<ClassInstance[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddSession, setShowAddSession] = useState(false);
  const [showQuickAddWeek, setShowQuickAddWeek] = useState(false);
  const [editingSession, setEditingSession] = useState<ClassInstance | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string>('');


  // Load sessions and classes on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load both sessions and classes
      const [sessionsData, classesData] = await Promise.all([
        ClassManagementService.getAllClassInstances(),
        ClassManagementService.getAllClasses()
      ]);
      
      setSessions(sessionsData);
      setClasses(classesData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load sessions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSession = async (sessionData: {
    classId: string;
    class_date: string;
    zoomMeetingId?: string;
    zoomPassword?: string;
    zoomLink?: string;
  }) => {
    try {
      // Get the class template to get class details
      const classTemplate = classes.find(c => c.id === sessionData.classId);
      if (!classTemplate) {
        throw new Error('Class template not found');
      }

      // Convert date format for Zoom API
      const convertDayToDate = (dateStr: string) => {
        // Parse "2025-09-11" to "Sep 11" format for Zoom API
        const date = new Date(dateStr);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        return `${month} ${day}`;
      };

      const formattedDate = convertDayToDate(sessionData.class_date);
      const timeFormatted = classTemplate.start_time.substring(0, 5); // Convert "08:00:00" to "08:00"
      const duration = parseInt(classTemplate.duration.replace(' min', '')); // Convert "60 min" to 60

      // Create the class instance without Zoom data
      // Zoom meetings will be created when students book the class
      await ClassManagementService.createClassInstance(
        sessionData.classId,
        sessionData.class_date
      );
      
      toast.success('Session created successfully! Zoom meetings will be created when students book.');
      
      loadData();
      setShowAddSession(false);
    } catch (err: any) {
      console.error('Error adding session:', err);
      toast.error(`Failed to add session: ${err.message}`);
    }
  };

  const handleUpdateSession = async (instanceId: string, updates: Partial<ClassInstance>) => {
    try {
      await ClassManagementService.updateClassInstance(instanceId, updates);
      
      toast.success('Session updated successfully!');
      
      loadData();
      setEditingSession(null);
    } catch (err: any) {
      console.error('Error updating session:', err);
      toast.error(`Failed to update session: ${err.message}`);
    }
  };

  const handleDeleteSession = async (instanceId: string) => {
    if (!confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      return;
    }

    try {
      await ClassManagementService.deleteClassInstance(instanceId);
      
      toast.success('Session deleted successfully!');
      
      loadData();
    } catch (err: any) {
      console.error('Error deleting session:', err);
      toast.error(`Failed to delete session: ${err.message}`);
    }
  };

  const handleToggleCancelled = async (instanceId: string, currentStatus: boolean) => {
    try {
      await ClassManagementService.updateClassInstance(instanceId, { 
        is_cancelled: !currentStatus 
      });
      
      toast.success(`Session ${!currentStatus ? 'cancelled' : 'restored'} successfully!`);
      
      loadData();
    } catch (err: any) {
      console.error('Error toggling session status:', err);
      toast.error(`Failed to update session status: ${err.message}`);
    }
  };

  const handleQuickAddWeek = async (weekData: {
    startDate: string;
    selectedClasses: string[];
  }) => {
    try {
      const startDate = new Date(weekData.startDate);
      const sessionsToCreate = [];

      // Create sessions for each day of the week
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + dayOffset);
        const dateStr = currentDate.toISOString().split('T')[0];
        const dayOfWeek = currentDate.getDay();

        // Find classes that match this day of week
        const classesForDay = classes.filter(cls => 
          cls.day_of_week === dayOfWeek && 
          weekData.selectedClasses.includes(cls.id)
        );

        // Create sessions for each class
        for (const cls of classesForDay) {
          sessionsToCreate.push({
            classId: cls.id,
            class_date: dateStr
          });
        }
      }

      // Create all sessions with Zoom meetings
      for (const sessionData of sessionsToCreate) {
        // Get the class template
        const classTemplate = classes.find(c => c.id === sessionData.classId);
        if (!classTemplate) continue;

        // Convert date format for Zoom API
        const convertDayToDate = (dateStr: string) => {
          const date = new Date(dateStr);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const month = monthNames[date.getMonth()];
          const day = date.getDate();
          return `${month} ${day}`;
        };

        const formattedDate = convertDayToDate(sessionData.class_date);
        const timeFormatted = classTemplate.start_time.substring(0, 5);
        const duration = parseInt(classTemplate.duration.replace(' min', ''));

        // Create the class instance without Zoom data
        // Zoom meetings will be created when students book the class
        await ClassManagementService.createClassInstance(
          sessionData.classId,
          sessionData.class_date
        );
      }

      toast.success(`Successfully created ${sessionsToCreate.length} sessions for the week!`);
      
      loadData();
      setShowQuickAddWeek(false);
    } catch (err: any) {
      console.error('Error adding week:', err);
      toast.error(`Failed to add week: ${err.message}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const filteredSessions = sessions.filter(session => {
    if (!dateFilter) return true;
    return session.class_date.includes(dateFilter);
  });

  if (loading) {
    return <div className="text-center py-8">Loading sessions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading">Manage Class Sessions</h2>
        <div className="flex gap-2">
          <Input
            type="date"
            placeholder="Filter by date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-48"
          />
          <Button onClick={() => setShowAddSession(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Session
          </Button>
          <Button onClick={() => setShowQuickAddWeek(true)} variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Quick Add Week
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      <div className="grid gap-4">
        {filteredSessions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">No sessions found.</p>
              <Button onClick={() => setShowAddSession(true)}>
                Create Your First Session
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredSessions.map((session) => (
            <Card key={session.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {session.class?.name || 'Unknown Class'}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={session.is_cancelled ? 'bg-red-500' : 'bg-green-500'}>
                    {session.is_cancelled ? 'Cancelled' : 'Active'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(session.class_date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{formatTime(session.class?.start_time || '00:00')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{session.class?.teacher || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {session.class?.duration || '60 min'}
                    </span>
                  </div>
                </div>

                {session.zoom_meeting_id && (
                  <div className="bg-muted/50 rounded-lg p-3 mb-4">
                    <h4 className="font-medium mb-2">Zoom Meeting Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Meeting ID:</strong> {session.zoom_meeting_id}</p>
                      {session.zoom_password && (
                        <p><strong>Password:</strong> {session.zoom_password}</p>
                      )}
                      {session.zoom_link && (
                        <p><strong>Join Link:</strong> 
                          <a 
                            href={session.zoom_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline ml-1"
                          >
                            Click to join
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setEditingSession(session)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleToggleCancelled(session.id, session.is_cancelled)}
                  >
                    {session.is_cancelled ? 'Restore' : 'Cancel'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDeleteSession(session.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Session Dialog */}
      {showAddSession && (
        <AddSessionDialog
          classes={classes}
          onAddSession={handleAddSession}
          onClose={() => setShowAddSession(false)}
        />
      )}

      {/* Edit Session Dialog */}
      {editingSession && (
        <EditSessionDialog
          session={editingSession}
          classes={classes}
          onUpdateSession={handleUpdateSession}
          onClose={() => setEditingSession(null)}
        />
      )}

      {/* Quick Add Week Dialog */}
      {showQuickAddWeek && (
        <QuickAddWeekDialog
          classes={classes}
          onAddWeek={handleQuickAddWeek}
          onClose={() => setShowQuickAddWeek(false)}
        />
      )}
    </div>
  );
}

// Add Session Dialog Component
function AddSessionDialog({ 
  classes, 
  onAddSession, 
  onClose 
}: { 
  classes: Class[];
  onAddSession: (data: any) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    classId: '',
    class_date: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSession(formData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Session</DialogTitle>
          <DialogDescription>
            Create a new class session for a specific date.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="classId">Class</Label>
            <select
              id="classId"
              value={formData.classId}
              onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} - {cls.teacher} ({cls.start_time})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="class_date">Date</Label>
            <Input
              id="class_date"
              type="date"
              value={formData.class_date}
              onChange={(e) => setFormData({ ...formData, class_date: e.target.value })}
              required
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-800">Zoom Meeting</span>
            </div>
            <p className="text-sm text-blue-700">
              Zoom meetings will be automatically created when students book this class session.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Session</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Edit Session Dialog Component
function EditSessionDialog({ 
  session, 
  classes, 
  onUpdateSession, 
  onClose 
}: { 
  session: ClassInstance;
  classes: Class[];
  onUpdateSession: (id: string, data: any) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    class_date: session.class_date,
    is_cancelled: session.is_cancelled
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSession(session.id, formData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Session</DialogTitle>
          <DialogDescription>
            Update the session details and Zoom meeting information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Class</Label>
            <div className="p-2 bg-muted rounded-md">
              {session.class?.name} - {session.class?.teacher} ({session.class?.start_time})
            </div>
          </div>

          <div>
            <Label htmlFor="class_date">Date</Label>
            <Input
              id="class_date"
              type="date"
              value={formData.class_date}
              onChange={(e) => setFormData({ ...formData, class_date: e.target.value })}
              required
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-800">Zoom Meeting</span>
            </div>
            <p className="text-sm text-blue-700">
              Zoom meetings are automatically created when students book this class session.
            </p>
            {session.zoom_meeting_id && (
              <div className="mt-2 text-xs text-blue-600">
                <p>Meeting ID: {session.zoom_meeting_id}</p>
                {session.zoom_link && (
                  <p>Join Link: <a href={session.zoom_link} target="_blank" rel="noopener noreferrer" className="underline">Click to join</a></p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_cancelled"
              checked={formData.is_cancelled}
              onChange={(e) => setFormData({ ...formData, is_cancelled: e.target.checked })}
            />
            <Label htmlFor="is_cancelled">Session is cancelled</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Session</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Quick Add Week Dialog Component
function QuickAddWeekDialog({ 
  classes, 
  onAddWeek, 
  onClose 
}: { 
  classes: Class[];
  onAddWeek: (data: { startDate: string; selectedClasses: string[] }) => void;
  onClose: () => void;
}) {
  const [startDate, setStartDate] = useState('');
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || selectedClasses.length === 0) {
      toast.error('Please select a start date and at least one class');
      return;
    }
    onAddWeek({ startDate, selectedClasses });
  };

  const toggleClass = (classId: string) => {
    setSelectedClasses(prev => 
      prev.includes(classId) 
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const classesByDay = classes.reduce((acc, cls) => {
    const dayName = dayNames[cls.day_of_week];
    if (!acc[dayName]) acc[dayName] = [];
    acc[dayName].push(cls);
    return acc;
  }, {} as Record<string, Class[]>);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quick Add Week</DialogTitle>
          <DialogDescription>
            Select a start date and classes to automatically create sessions for the entire week.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="startDate">Week Start Date (Monday)</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Select the Monday of the week you want to add classes for
            </p>
          </div>

          <div>
            <Label>Select Classes to Add</Label>
            <div className="grid gap-4 md:grid-cols-2 mt-2">
              {Object.entries(classesByDay).map(([dayName, dayClasses]) => (
                <Card key={dayName}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{dayName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {dayClasses.map((cls) => (
                      <div key={cls.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={cls.id}
                          checked={selectedClasses.includes(cls.id)}
                          onChange={() => toggleClass(cls.id)}
                          className="rounded"
                        />
                        <label htmlFor={cls.id} className="text-sm cursor-pointer flex-1">
                          <div className="font-medium">{cls.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {cls.start_time} • {cls.teacher} • {cls.level}
                          </div>
                        </label>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Week ({selectedClasses.length} classes selected)
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
