import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Calendar, Clock, Users, Plus, Edit, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { ClassManagementService, Class, ClassInstance } from '../utils/class-management';

interface AdminScheduleEditorProps {
  onClose?: () => void;
}

export function AdminScheduleEditor({ onClose }: AdminScheduleEditorProps) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddClass, setShowAddClass] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const teachers = ['Harshada', 'Archana'];
  const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
  const daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];

  // Load classes on mount
  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const classData = await ClassManagementService.getAllClasses(); // Get both active and inactive
      setClasses(classData);
    } catch (err) {
      console.error('Error loading classes:', err);
      setError('Failed to load classes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = async (classData: Omit<Class, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      await ClassManagementService.createClass(classData);
      setSuccess('Class added successfully!');
      setShowAddClass(false);
      loadClasses();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error adding class:', err);
      setError('Failed to add class. Please try again.');
    }
  };

  const handleUpdateClass = async (classId: string, updates: Partial<Class>) => {
    try {
      setError(null);
      await ClassManagementService.updateClass(classId, updates);
      setSuccess('Class updated successfully!');
      setEditingClass(null);
      loadClasses();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating class:', err);
      setError('Failed to update class. Please try again.');
    }
  };

  const handleDeleteClass = async (classId: string) => {
    if (!confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      return;
    }

    try {
      setError(null);
      await ClassManagementService.deleteClass(classId);
      setSuccess('Class deleted successfully!');
      loadClasses();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting class:', err);
      setError('Failed to delete class. Please try again.');
    }
  };

  const handleToggleActive = async (classId: string, isActive: boolean) => {
    try {
      setError(null);
      await ClassManagementService.updateClass(classId, { is_active: !isActive });
      setSuccess(`Class ${!isActive ? 'activated' : 'deactivated'} successfully!`);
      loadClasses();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error toggling class status:', err);
      setError('Failed to update class status. Please try again.');
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDayLabel = (dayOfWeek: number) => {
    return daysOfWeek.find(day => day.value === dayOfWeek)?.label || 'Unknown';
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-2">Loading classes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading">Class Schedule Management</h2>
          <p className="text-muted-foreground">
            Manage your yoga class schedule. Add, edit, or remove classes as needed.
          </p>
        </div>
        <Dialog open={showAddClass} onOpenChange={setShowAddClass}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
            </DialogHeader>
            <AddClassForm 
              teachers={teachers}
              levels={levels}
              daysOfWeek={daysOfWeek}
              onAddClass={handleAddClass}
              onClose={() => setShowAddClass(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}

      {/* Classes List */}
      <div className="grid gap-4">
        {classes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No Classes Yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first yoga class to the schedule.
              </p>
              <Button onClick={() => setShowAddClass(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Class
              </Button>
            </CardContent>
          </Card>
        ) : (
          classes.map((classItem) => (
            <Card key={classItem.id} className={classItem.is_active ? '' : 'opacity-60'}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{classItem.name}</h3>
                      <Badge 
                        variant={classItem.is_active ? "default" : "secondary"}
                        className={classItem.is_active ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        {classItem.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {classItem.level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {getDayLabel(classItem.day_of_week)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(classItem.start_time)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {classItem.teacher}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {classItem.duration} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Max {classItem.max_students} students
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingClass(classItem)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleActive(classItem.id, classItem.is_active)}
                    >
                      {classItem.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteClass(classItem.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Class Dialog */}
      {editingClass && (
        <Dialog open={!!editingClass} onOpenChange={() => setEditingClass(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Class</DialogTitle>
            </DialogHeader>
            <EditClassForm 
              classData={editingClass}
              teachers={teachers}
              levels={levels}
              daysOfWeek={daysOfWeek}
              onUpdateClass={handleUpdateClass}
              onClose={() => setEditingClass(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Add Class Form Component
function AddClassForm({ 
  teachers, 
  levels,
  daysOfWeek,
  onAddClass, 
  onClose 
}: {
  teachers: string[];
  levels: string[];
  daysOfWeek: { value: number; label: string }[];
  onAddClass: (classData: Omit<Class, 'id' | 'created_at' | 'updated_at'>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    teacher: '',
    day_of_week: 1, // Monday default
    start_time: '',
    duration: 60,
    level: 'All Levels',
    max_students: 10,
    is_active: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.teacher || !formData.start_time) {
      alert('Please fill in all required fields');
      return;
    }
    onAddClass(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Class Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Morning Flow"
          required
        />
      </div>

      <div>
        <Label htmlFor="teacher">Teacher *</Label>
        <Select value={formData.teacher} onValueChange={(value) => setFormData(prev => ({ ...prev, teacher: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select teacher" />
          </SelectTrigger>
          <SelectContent>
            {teachers.map((teacher) => (
              <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="day_of_week">Day of Week *</Label>
        <Select value={formData.day_of_week.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, day_of_week: parseInt(value) }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {daysOfWeek.map((day) => (
              <SelectItem key={day.value} value={day.value.toString()}>{day.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="start_time">Start Time *</Label>
        <Input
          id="start_time"
          type="time"
          value={formData.start_time}
          onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input
          id="duration"
          type="number"
          value={formData.duration}
          onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
          min="30"
          max="120"
        />
      </div>

      <div>
        <Label htmlFor="level">Level</Label>
        <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {levels.map((level) => (
              <SelectItem key={level} value={level}>{level}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="max_students">Max Students</Label>
        <Input
          id="max_students"
          type="number"
          value={formData.max_students}
          onChange={(e) => setFormData(prev => ({ ...prev, max_students: parseInt(e.target.value) }))}
          min="1"
          max="20"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Add Class</Button>
      </div>
    </form>
  );
}

// Edit Class Form Component
function EditClassForm({ 
  classData, 
  teachers, 
  levels,
  daysOfWeek,
  onUpdateClass, 
  onClose 
}: {
  classData: Class;
  teachers: string[];
  levels: string[];
  daysOfWeek: { value: number; label: string }[];
  onUpdateClass: (classId: string, updates: Partial<Class>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: classData.name,
    teacher: classData.teacher,
    day_of_week: classData.day_of_week,
    start_time: classData.start_time,
    duration: classData.duration,
    level: classData.level,
    max_students: classData.max_students,
    is_active: classData.is_active
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateClass(classData.id, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Class Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="teacher">Teacher</Label>
        <Select value={formData.teacher} onValueChange={(value) => setFormData(prev => ({ ...prev, teacher: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {teachers.map((teacher) => (
              <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="day_of_week">Day of Week</Label>
        <Select value={formData.day_of_week.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, day_of_week: parseInt(value) }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {daysOfWeek.map((day) => (
              <SelectItem key={day.value} value={day.value.toString()}>{day.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="start_time">Start Time</Label>
        <Input
          id="start_time"
          type="time"
          value={formData.start_time}
          onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input
          id="duration"
          type="number"
          value={formData.duration}
          onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
          min="30"
          max="120"
        />
      </div>

      <div>
        <Label htmlFor="level">Level</Label>
        <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {levels.map((level) => (
              <SelectItem key={level} value={level}>{level}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="max_students">Max Students</Label>
        <Input
          id="max_students"
          type="number"
          value={formData.max_students}
          onChange={(e) => setFormData(prev => ({ ...prev, max_students: parseInt(e.target.value) }))}
          min="1"
          max="20"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Update Class</Button>
      </div>
    </form>
  );
}
