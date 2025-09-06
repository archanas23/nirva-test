
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Copy, CheckCircle, Plus, Edit2, Trash2, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { toast } from "sonner";

interface ZoomClass {
  id: string;
  className: string;
  teacher: string;
  date: string;
  time: string;
  zoomLink: string;
  meetingId: string;
  passcode: string;
  maxStudents: number;
  currentEnrollment: number;
  status: 'active' | 'full' | 'cancelled';
}

interface ZoomLinkManagementProps {
  onUpdateClass?: (classData: ZoomClass) => void;
}

export function ZoomLinkManagement({ onUpdateClass }: ZoomLinkManagementProps) {
  const [classes, setClasses] = useState<ZoomClass[]>([
    {
      id: "1",
      className: "Power Yoga",
      teacher: "Archana Soundararajan",
      date: "Mon 9 Sep 2025",
      time: "7:30 AM EST",
      zoomLink: "https://zoom.us/j/1234567890?pwd=power123",
      meetingId: "123 456 7890",
      passcode: "POWER123",
      maxStudents: 10,
      currentEnrollment: 0,
      status: "active"
    },
    {
      id: "2", 
      className: "Gentle Hatha",
      teacher: "Harshada Madiraju",
      date: "Mon 9 Sep 2025", 
      time: "6:30 PM EST",
      zoomLink: "https://zoom.us/j/0987654321?pwd=hatha456",
      meetingId: "098 765 4321",
      passcode: "HATHA456",
      maxStudents: 10,
      currentEnrollment: 0,
      status: "active"
    },
    {
      id: "3",
      className: "Vinyasa Flow",
      teacher: "Archana Soundararajan", 
      date: "Tue 10 Sep 2025",
      time: "6:30 PM EST",
      zoomLink: "https://zoom.us/j/1122334455?pwd=vinyasa789",
      meetingId: "112 233 4455",
      passcode: "VINYASA789",
      maxStudents: 10,
      currentEnrollment: 0,
      status: "active"
    }
  ]);

  const [editingClass, setEditingClass] = useState<ZoomClass | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    className: "",
    teacher: "Harshada Madiraju",
    date: "",
    time: "",
    zoomLink: "",
    meetingId: "",
    passcode: "",
    maxStudents: 10
  });
  const [copiedLinks, setCopiedLinks] = useState<Record<string, boolean>>({});

  const copyToClipboard = (text: string, type: string, classId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLinks(prev => ({ ...prev, [`${classId}-${type}`]: true }));
    toast.success(`${type} copied to clipboard!`);
    setTimeout(() => {
      setCopiedLinks(prev => ({ ...prev, [`${classId}-${type}`]: false }));
    }, 2000);
  };

  const generateZoomMeetingData = () => {
    // Generate realistic-looking Zoom meeting data
    const meetingId = Math.floor(100000000 + Math.random() * 900000000).toString();
    const formattedMeetingId = `${meetingId.slice(0,3)} ${meetingId.slice(3,6)} ${meetingId.slice(6,9)}`;
    const passcode = `NIRVA${Math.floor(100 + Math.random() * 900)}`;
    const zoomLink = `https://zoom.us/j/${meetingId}?pwd=${passcode.toLowerCase()}`;
    
    setFormData(prev => ({
      ...prev,
      meetingId: formattedMeetingId,
      passcode,
      zoomLink
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingClass) {
      // Update existing class
      const updatedClass = {
        ...editingClass,
        ...formData,
        currentEnrollment: editingClass.currentEnrollment
      };
      
      setClasses(prev => prev.map(c => c.id === editingClass.id ? updatedClass : c));
      setEditingClass(null);
      toast.success("Class updated successfully!");
      
      if (onUpdateClass) {
        onUpdateClass(updatedClass);
      }
    } else {
      // Create new class
      const newClass: ZoomClass = {
        id: Date.now().toString(),
        ...formData,
        currentEnrollment: 0,
        status: "active" as const
      };
      
      setClasses(prev => [...prev, newClass]);
      setIsCreateModalOpen(false);
      toast.success("New class created successfully!");
      
      if (onUpdateClass) {
        onUpdateClass(newClass);
      }
    }
    
    // Reset form
    setFormData({
      className: "",
      teacher: "Harshada Madiraju",
      date: "", 
      time: "",
      zoomLink: "",
      meetingId: "",
      passcode: "",
      maxStudents: 10
    });
  };

  const handleEdit = (classItem: ZoomClass) => {
    setEditingClass(classItem);
    setFormData({
      className: classItem.className,
      teacher: classItem.teacher,
      date: classItem.date,
      time: classItem.time,
      zoomLink: classItem.zoomLink,
      meetingId: classItem.meetingId,
      passcode: classItem.passcode,
      maxStudents: classItem.maxStudents
    });
  };

  const handleDelete = (classId: string) => {
    if (confirm("Are you sure you want to delete this class? This action cannot be undone.")) {
      setClasses(prev => prev.filter(c => c.id !== classId));
      toast.success("Class deleted successfully!");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'full': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const ClassForm = ({ isEditing = false }: { isEditing?: boolean }) => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="className">Class Name</Label>
          <Input
            id="className"
            value={formData.className}
            onChange={(e) => setFormData(prev => ({ ...prev, className: e.target.value }))}
            placeholder="e.g., Gentle Hatha Flow"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="teacher">Teacher</Label>
          <select
            id="teacher"
            value={formData.teacher}
            onChange={(e) => setFormData(prev => ({ ...prev, teacher: e.target.value }))}
            className="w-full p-2 border border-border rounded-md bg-background"
            required
          >
            <option value="Harshada Madiraju">Harshada Madiraju</option>
            <option value="Archana Soundararajan">Archana Soundararajan</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            value={formData.time}
            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            placeholder="e.g., 7:00 PM EST"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="maxStudents">Max Students</Label>
        <Input
          id="maxStudents"
          type="number"
          min="1"
          max="50"
          value={formData.maxStudents}
          onChange={(e) => setFormData(prev => ({ ...prev, maxStudents: parseInt(e.target.value) }))}
          required
        />
      </div>

      <Separator />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Zoom Meeting Details</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={generateZoomMeetingData}
          >
            Generate New Meeting
          </Button>
        </div>

        <div>
          <Label htmlFor="zoomLink">Zoom Link</Label>
          <Input
            id="zoomLink"
            value={formData.zoomLink}
            onChange={(e) => setFormData(prev => ({ ...prev, zoomLink: e.target.value }))}
            placeholder="https://zoom.us/j/1234567890?pwd=example"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="meetingId">Meeting ID</Label>
            <Input
              id="meetingId"
              value={formData.meetingId}
              onChange={(e) => setFormData(prev => ({ ...prev, meetingId: e.target.value }))}
              placeholder="123 456 7890"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="passcode">Passcode</Label>
            <Input
              id="passcode"
              value={formData.passcode}
              onChange={(e) => setFormData(prev => ({ ...prev, passcode: e.target.value }))}
              placeholder="NIRVA123"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {isEditing ? "Update Class" : "Create Class"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            if (isEditing) {
              setEditingClass(null);
            } else {
              setIsCreateModalOpen(false);
            }
            setFormData({
              className: "",
              teacher: "Harshada Madiraju",
              date: "",
              time: "",
              zoomLink: "",
              meetingId: "",
              passcode: "",
              maxStudents: 10
            });
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2>Zoom Link Management</h2>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Class
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
              <DialogDescription>
                Add a new virtual yoga class with Zoom meeting details.
              </DialogDescription>
            </DialogHeader>
            <ClassForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {classes.map((classItem) => (
          <Card key={classItem.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{classItem.className}</CardTitle>
                  <p className="text-muted-foreground">
                    {classItem.date} at {classItem.time} with {classItem.teacher}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(classItem.status)}>
                    {classItem.status}
                  </Badge>
                  <Badge variant="outline">
                    {classItem.currentEnrollment}/{classItem.maxStudents} enrolled
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Zoom Link */}
              <div className="space-y-2">
                <Label>Zoom Link</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    value={classItem.zoomLink} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(classItem.zoomLink, "Zoom Link", classItem.id)}
                  >
                    {copiedLinks[`${classItem.id}-link`] ? 
                      <CheckCircle className="w-4 h-4" /> : 
                      <Copy className="w-4 h-4" />
                    }
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(classItem.zoomLink, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Meeting Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Meeting ID</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={classItem.meetingId} 
                      readOnly 
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(classItem.meetingId.replace(/\s/g, ''), "Meeting ID", classItem.id)}
                    >
                      {copiedLinks[`${classItem.id}-meetingId`] ? 
                        <CheckCircle className="w-4 h-4" /> : 
                        <Copy className="w-4 h-4" />
                      }
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Passcode</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={classItem.passcode} 
                      readOnly 
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(classItem.passcode, "Passcode", classItem.id)}
                    >
                      {copiedLinks[`${classItem.id}-passcode`] ? 
                        <CheckCircle className="w-4 h-4" /> : 
                        <Copy className="w-4 h-4" />
                      }
                    </Button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <Dialog open={editingClass?.id === classItem.id} onOpenChange={(open) => !open && setEditingClass(null)}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(classItem)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Class</DialogTitle>
                      <DialogDescription>
                        Update the class details and Zoom meeting information.
                      </DialogDescription>
                    </DialogHeader>
                    <ClassForm isEditing={true} />
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(classItem.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {classes.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No classes created yet.</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Create Your First Class
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}