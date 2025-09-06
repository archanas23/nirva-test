// Schedule management service for admin
export interface ClassTemplate {
  id: string;
  name: string;
  teacher: string;
  duration: number; // in minutes
  level: string;
  description?: string;
  maxStudents: number;
  isActive: boolean;
}

export interface ScheduledClass {
  id: string;
  templateId: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  teacher: string;
  className: string;
  duration: number;
  level: string;
  maxStudents: number;
  currentEnrollment: number;
  isActive: boolean;
  zoomMeetingId?: string;
  zoomPassword?: string;
  zoomLink?: string;
}

export interface WeeklySchedule {
  weekStart: string; // Monday date in YYYY-MM-DD format
  weekEnd: string; // Sunday date in YYYY-MM-DD format
  classes: ScheduledClass[];
}

export class ScheduleManagementService {
  private static classTemplates: ClassTemplate[] = [
    {
      id: "template-1",
      name: "Morning Flow",
      teacher: "Harshada",
      duration: 60,
      level: "All Levels",
      description: "Start your day with energizing yoga flow",
      maxStudents: 10,
      isActive: true
    },
    {
      id: "template-2",
      name: "Evening Restore",
      teacher: "Archana",
      duration: 60,
      level: "All Levels",
      description: "Wind down with gentle restorative yoga",
      maxStudents: 10,
      isActive: true
    },
    {
      id: "template-3",
      name: "Sunday Restore",
      teacher: "Harshada",
      duration: 60,
      level: "All Levels",
      description: "Gentle Sunday morning practice",
      maxStudents: 10,
      isActive: true
    },
    {
      id: "template-4",
      name: "Sunset Flow",
      teacher: "Archana",
      duration: 60,
      level: "All Levels",
      description: "Evening flow to end the day",
      maxStudents: 10,
      isActive: true
    },
    {
      id: "template-5",
      name: "Saturday Flow",
      teacher: "Harshada",
      duration: 60,
      level: "All Levels",
      description: "Weekend energizing practice",
      maxStudents: 10,
      isActive: true
    },
    {
      id: "template-6",
      name: "Weekend Restore",
      teacher: "Archana",
      duration: 60,
      level: "All Levels",
      description: "Relaxing weekend practice",
      maxStudents: 10,
      isActive: true
    }
  ];

  private static weeklySchedules: Map<string, WeeklySchedule> = new Map();

  // Get all class templates
  static getClassTemplates(): ClassTemplate[] {
    return this.classTemplates.filter(template => template.isActive);
  }

  // Add new class template
  static addClassTemplate(template: Omit<ClassTemplate, 'id'>): ClassTemplate {
    const newTemplate: ClassTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      isActive: true
    };
    this.classTemplates.push(newTemplate);
    return newTemplate;
  }

  // Update class template
  static updateClassTemplate(id: string, updates: Partial<ClassTemplate>): boolean {
    const index = this.classTemplates.findIndex(template => template.id === id);
    if (index === -1) return false;
    
    this.classTemplates[index] = { ...this.classTemplates[index], ...updates };
    return true;
  }

  // Delete class template
  static deleteClassTemplate(id: string): boolean {
    const index = this.classTemplates.findIndex(template => template.id === id);
    if (index === -1) return false;
    
    this.classTemplates[index].isActive = false;
    return true;
  }

  // Get weekly schedule
  static getWeeklySchedule(weekStart: string): WeeklySchedule {
    if (this.weeklySchedules.has(weekStart)) {
      return this.weeklySchedules.get(weekStart)!;
    }

    // Generate default schedule if none exists
    return this.generateDefaultSchedule(weekStart);
  }

  // Generate default schedule for a week
  private static generateDefaultSchedule(weekStart: string): WeeklySchedule {
    const startDate = new Date(weekStart);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const classes: ScheduledClass[] = [];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Generate classes for each day
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayName = days[i];

      // Add classes based on day
      if (i === 0) { // Sunday
        classes.push(this.createScheduledClass('template-3', dateStr, '09:00', 'Harshada'));
        classes.push(this.createScheduledClass('template-4', dateStr, '17:00', 'Archana'));
      } else if (i === 6) { // Saturday
        classes.push(this.createScheduledClass('template-5', dateStr, '09:00', 'Harshada'));
        classes.push(this.createScheduledClass('template-6', dateStr, '17:00', 'Archana'));
      } else { // Weekdays
        classes.push(this.createScheduledClass('template-1', dateStr, '08:00', 'Harshada'));
        classes.push(this.createScheduledClass('template-2', dateStr, '18:00', 'Archana'));
      }
    }

    const schedule: WeeklySchedule = {
      weekStart,
      weekEnd: endDate.toISOString().split('T')[0],
      classes
    };

    this.weeklySchedules.set(weekStart, schedule);
    return schedule;
  }

  // Create a scheduled class from template
  private static createScheduledClass(
    templateId: string, 
    date: string, 
    time: string, 
    teacher: string
  ): ScheduledClass {
    const template = this.classTemplates.find(t => t.id === templateId);
    if (!template) throw new Error(`Template ${templateId} not found`);

    return {
      id: `class-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      templateId,
      date,
      time,
      teacher,
      className: template.name,
      duration: template.duration,
      level: template.level,
      maxStudents: template.maxStudents,
      currentEnrollment: 0,
      isActive: true
    };
  }

  // Add class to schedule
  static addClassToSchedule(
    weekStart: string,
    templateId: string,
    date: string,
    time: string,
    teacher: string
  ): ScheduledClass | null {
    try {
      const schedule = this.getWeeklySchedule(weekStart);
      const newClass = this.createScheduledClass(templateId, date, time, teacher);
      
      schedule.classes.push(newClass);
      this.weeklySchedules.set(weekStart, schedule);
      
      return newClass;
    } catch (error) {
      console.error('Failed to add class to schedule:', error);
      return null;
    }
  }

  // Update scheduled class
  static updateScheduledClass(
    weekStart: string,
    classId: string,
    updates: Partial<ScheduledClass>
  ): boolean {
    const schedule = this.getWeeklySchedule(weekStart);
    const classIndex = schedule.classes.findIndex(cls => cls.id === classId);
    
    if (classIndex === -1) return false;
    
    schedule.classes[classIndex] = { ...schedule.classes[classIndex], ...updates };
    this.weeklySchedules.set(weekStart, schedule);
    
    return true;
  }

  // Remove class from schedule
  static removeClassFromSchedule(weekStart: string, classId: string): boolean {
    const schedule = this.getWeeklySchedule(weekStart);
    const classIndex = schedule.classes.findIndex(cls => cls.id === classId);
    
    if (classIndex === -1) return false;
    
    schedule.classes.splice(classIndex, 1);
    this.weeklySchedules.set(weekStart, schedule);
    
    return true;
  }

  // Copy schedule from previous week
  static copyPreviousWeek(currentWeekStart: string): boolean {
    const currentDate = new Date(currentWeekStart);
    const previousWeekDate = new Date(currentDate);
    previousWeekDate.setDate(currentDate.getDate() - 7);
    const previousWeekStart = previousWeekDate.toISOString().split('T')[0];

    const previousSchedule = this.getWeeklySchedule(previousWeekStart);
    const newSchedule: WeeklySchedule = {
      weekStart: currentWeekStart,
      weekEnd: this.getWeekEnd(currentWeekStart),
      classes: previousSchedule.classes.map(cls => ({
        ...cls,
        id: `class-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        date: this.adjustDateForWeek(cls.date, previousWeekStart, currentWeekStart),
        currentEnrollment: 0
      }))
    };

    this.weeklySchedules.set(currentWeekStart, newSchedule);
    return true;
  }

  // Get week end date
  private static getWeekEnd(weekStart: string): string {
    const startDate = new Date(weekStart);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    return endDate.toISOString().split('T')[0];
  }

  // Adjust date for new week
  private static adjustDateForWeek(originalDate: string, oldWeekStart: string, newWeekStart: string): string {
    const oldStart = new Date(oldWeekStart);
    const newStart = new Date(newWeekStart);
    const original = new Date(originalDate);
    
    const dayDiff = Math.floor((original.getTime() - oldStart.getTime()) / (1000 * 60 * 60 * 24));
    const newDate = new Date(newStart);
    newDate.setDate(newStart.getDate() + dayDiff);
    
    return newDate.toISOString().split('T')[0];
  }

  // Get available time slots for a day
  static getAvailableTimeSlots(date: string): string[] {
    const timeSlots = [
      '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
      '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
      '18:00', '19:00', '20:00', '21:00'
    ];

    const schedule = this.getWeeklySchedule(this.getWeekStart(date));
    const existingTimes = schedule.classes
      .filter(cls => cls.date === date)
      .map(cls => cls.time);

    return timeSlots.filter(time => !existingTimes.includes(time));
  }

  // Get week start date (Monday) for any given date
  static getWeekStart(date: string): string {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split('T')[0];
  }

  // Get all teachers
  static getTeachers(): string[] {
    return [...new Set(this.classTemplates.map(template => template.teacher))];
  }

  // Export schedule as JSON
  static exportSchedule(weekStart: string): string {
    const schedule = this.getWeeklySchedule(weekStart);
    return JSON.stringify(schedule, null, 2);
  }

  // Import schedule from JSON
  static importSchedule(weekStart: string, scheduleData: string): boolean {
    try {
      const schedule: WeeklySchedule = JSON.parse(scheduleData);
      this.weeklySchedules.set(weekStart, schedule);
      return true;
    } catch (error) {
      console.error('Failed to import schedule:', error);
      return false;
    }
  }
}
