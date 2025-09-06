import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Calendar, Clock, Users, Plus, Edit, Trash2, Copy, Download, Upload } from 'lucide-react';
import { ScheduleManagementService, ClassTemplate, ScheduledClass, WeeklySchedule } from '../utils/schedule-management';

interface ScheduleEditorProps {
  onClose?: () => void;
}

export function ScheduleEditor({ onClose }: ScheduleEditorProps) {
  const [currentWeek, setCurrentWeek] = useState<string>('');
  const [schedule, setSchedule] = useState<WeeklySchedule | null>(null);
  const [templates, setTemplates] = useState<ClassTemplate[]>([]);
  const [teachers, setTeachers] = useState<string[]>([]);
  const [showAddClass, setShowAddClass] = useState(false);
  const [editingClass, setEditingClass] = useState<ScheduledClass | null>(null);
  const [showTemplateManager, setShowTemplateManager] = useState(false);

  // Initialize current week (Monday)
  useEffect(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    setCurrentWeek(monday.toISOString().split('T')[0]);
  }, []);

  // Load schedule and templates when week changes
  useEffect(() => {
    if (currentWeek) {
      const weeklySchedule = ScheduleManagementService.getWeeklySchedule(currentWeek);
      setSchedule(weeklySchedule);
      
      const classTemplates = ScheduleManagementService.getClassTemplates();
      setTemplates(classTemplates);
      
      const teacherList = ScheduleManagementService.getTeachers();
      setTeachers(teacherList);
    }
  }, [currentWeek]);

  const handleWeekChange = (direction: 'prev' | 'next') => {
    const currentDate = new Date(currentWeek);
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate.toISOString().split('T')[0]);
  };

  const handleAddClass = (templateId: string, date: string, time: string, teacher: string) => {
    const newClass = ScheduleManagementService.addClassToSchedule(currentWeek, templateId, date, time, teacher);
    if (newClass) {
      setSchedule(ScheduleManagementService.getWeeklySchedule(currentWeek));
      setShowAddClass(false);
    }
  };

  const handleUpdateClass = (classId: string, updates: Partial<ScheduledClass>) => {
    const success = ScheduleManagementService.updateScheduledClass(currentWeek, classId, updates);
    if (success) {
      setSchedule(ScheduleManagementService.getWeeklySchedule(currentWeek));
      setEditingClass(null);
    }
  };

  const handleDeleteClass = (classId: string) => {
    const success = ScheduleManagementService.removeClassFromSchedule(currentWeek, classId);
    if (success) {
      setSchedule(ScheduleManagementService.getWeeklySchedule(currentWeek));
    }
  };

  const handleCopyPreviousWeek = () => {
    const success = ScheduleManagementService.copyPreviousWeek(currentWeek);
    if (success) {
      setSchedule(ScheduleManagementService.getWeeklySchedule(currentWeek));
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getClassesForDay = (date: string) => {
    if (!schedule) return [];
    return schedule.classes.filter(cls => cls.date === date);
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getWeekDates = () => {
    if (!currentWeek) return [];
    const dates = [];
    const startDate = new Date(currentWeek);
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  if (!schedule) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading">Schedule Management</h2>
          <p className="text-muted-foreground">
            Week of {formatDate(currentWeek)} - {formatDate(schedule.weekEnd)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleWeekChange('prev')}>
            ← Previous Week
          </Button>
          <Button variant="outline" onClick={() => handleWeekChange('next')}>
            Next Week →
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
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
              templates={templates}
              teachers={teachers}
              onAddClass={handleAddClass}
              onClose={() => setShowAddClass(false)}
            />
          </DialogContent>
        </Dialog>

        <Button variant="outline" onClick={handleCopyPreviousWeek}>
          <Copy className="w-4 h-4 mr-2" />
          Copy Previous Week
        </Button>

        <Button variant="outline" onClick={() => setShowTemplateManager(true)}>
          Manage Templates
        </Button>

        <Button variant="outline" onClick={() => {
          const data = ScheduleManagementService.exportSchedule(currentWeek);
          const blob = new Blob([data], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `schedule-${currentWeek}.json`;
          a.click();
        }}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {getWeekDates().map((date) => (
          <Card key={date} className="min-h-[300px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                {getDayName(date)}
                <br />
                <span className="text-xs text-muted-foreground">
                  {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {getClassesForDay(date).map((cls) => (
                <div key={cls.id} className="p-2 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{cls.className}</span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingClass(cls)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClass(cls.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {cls.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {cls.teacher}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {cls.currentEnrollment}/{cls.maxStudents} students
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {cls.level}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {getClassesForDay(date).length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-4">
                  No classes scheduled
                </div>
              )}
            </CardContent>
          </Card>
        ))}
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
              templates={templates}
              teachers={teachers}
              onUpdateClass={handleUpdateClass}
              onClose={() => setEditingClass(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Template Manager Dialog */}
      {showTemplateManager && (
        <Dialog open={showTemplateManager} onOpenChange={setShowTemplateManager}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Manage Class Templates</DialogTitle>
            </DialogHeader>
            <TemplateManager 
              onClose={() => setShowTemplateManager(false)}
              onTemplatesUpdate={() => {
                setTemplates(ScheduleManagementService.getClassTemplates());
                setTeachers(ScheduleManagementService.getTeachers());
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Add Class Form Component
function AddClassForm({ 
  templates, 
  teachers, 
  onAddClass, 
  onClose 
}: {
  templates: ClassTemplate[];
  teachers: string[];
  onAddClass: (templateId: string, date: string, time: string, teacher: string) => void;
  onClose: () => void;
}) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTemplate && selectedDate && selectedTime && selectedTeacher) {
      onAddClass(selectedTemplate, selectedDate, selectedTime, selectedTeacher);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="template">Class Template</Label>
        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
          <SelectTrigger>
            <SelectValue placeholder="Select a class template" />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name} - {template.teacher} ({template.duration}min)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="time">Time</Label>
        <Input
          id="time"
          type="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="teacher">Teacher</Label>
        <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
          <SelectTrigger>
            <SelectValue placeholder="Select teacher" />
          </SelectTrigger>
          <SelectContent>
            {teachers.map((teacher) => (
              <SelectItem key={teacher} value={teacher}>
                {teacher}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
  templates, 
  teachers, 
  onUpdateClass, 
  onClose 
}: {
  classData: ScheduledClass;
  templates: ClassTemplate[];
  teachers: string[];
  onUpdateClass: (classId: string, updates: Partial<ScheduledClass>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    className: classData.className,
    teacher: classData.teacher,
    time: classData.time,
    maxStudents: classData.maxStudents,
    level: classData.level,
    isActive: classData.isActive
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateClass(classData.id, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="className">Class Name</Label>
        <Input
          id="className"
          value={formData.className}
          onChange={(e) => setFormData(prev => ({ ...prev, className: e.target.value }))}
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
              <SelectItem key={teacher} value={teacher}>
                {teacher}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="time">Time</Label>
        <Input
          id="time"
          type="time"
          value={formData.time}
          onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="maxStudents">Max Students</Label>
        <Input
          id="maxStudents"
          type="number"
          value={formData.maxStudents}
          onChange={(e) => setFormData(prev => ({ ...prev, maxStudents: parseInt(e.target.value) }))}
          min="1"
          max="20"
          required
        />
      </div>

      <div>
        <Label htmlFor="level">Level</Label>
        <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Levels">All Levels</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
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

// Template Manager Component
function TemplateManager({ onClose, onTemplatesUpdate }: { onClose: () => void; onTemplatesUpdate: () => void }) {
  const [templates, setTemplates] = useState<ClassTemplate[]>(ScheduleManagementService.getClassTemplates());
  const [showAddTemplate, setShowAddTemplate] = useState(false);

  const handleDeleteTemplate = (id: string) => {
    ScheduleManagementService.deleteClassTemplate(id);
    setTemplates(ScheduleManagementService.getClassTemplates());
    onTemplatesUpdate();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Class Templates</h3>
        <Button onClick={() => setShowAddTemplate(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Template
        </Button>
      </div>

      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {template.teacher} • {template.duration}min • {template.level} • Max {template.maxStudents} students
                  </p>
                  {template.description && (
                    <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteTemplate(template.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}
