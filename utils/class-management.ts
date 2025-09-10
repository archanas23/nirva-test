import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Class schema
export interface Class {
  id: string
  name: string
  teacher: string
  day_of_week: number // 0 = Sunday, 1 = Monday, etc.
  start_time: string // "09:00" format
  duration: number // minutes
  level: string
  max_students: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ClassInstance {
  id: string
  class_id: string
  class_date: string // "2025-09-07" format
  zoom_meeting_id?: string
  zoom_password?: string
  zoom_link?: string
  is_cancelled: boolean
  created_at: string
  updated_at: string
  class?: Class // Joined class data
}

export class ClassManagementService {
  // Get all active classes
  static async getClasses(): Promise<Class[]> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('is_active', true)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  // Get all classes (including inactive) - for admin
  static async getAllClasses(): Promise<Class[]> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  // Create a new class
  static async createClass(classData: Omit<Class, 'id' | 'created_at' | 'updated_at'>): Promise<Class> {
    const { data, error } = await supabase
      .from('classes')
      .insert([classData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Update a class
  static async updateClass(classId: string, updates: Partial<Class>): Promise<Class> {
    const { data, error } = await supabase
      .from('classes')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', classId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Delete a class
  static async deleteClass(classId: string): Promise<void> {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', classId)
    
    if (error) throw error
  }

  // Get class instances for a date range
  static async getClassInstances(startDate: string, endDate: string): Promise<ClassInstance[]> {
    const { data, error } = await supabase
      .from('class_instances')
      .select(`
        *,
        class:classes(*)
      `)
      .gte('class_date', startDate)
      .lte('class_date', endDate)
      .eq('is_cancelled', false)
      .order('class_date', { ascending: true })
      .order('start_time', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  // Create a class instance for a specific date
  static async createClassInstance(classId: string, classDate: string, zoomData?: {
    meetingId: string
    password: string
    joinUrl: string
  }): Promise<ClassInstance> {
    const { data, error } = await supabase
      .from('class_instances')
      .insert([{
        class_id: classId,
        class_date: classDate,
        zoom_meeting_id: zoomData?.meetingId,
        zoom_password: zoomData?.password,
        zoom_link: zoomData?.joinUrl,
        is_cancelled: false
      }])
      .select(`
        *,
        class:classes(*)
      `)
      .single()
    
    if (error) throw error
    return data
  }

  // Get or create class instance for a specific date
  static async getOrCreateClassInstance(classId: string, classDate: string): Promise<ClassInstance> {
    // First try to get existing instance
    const { data: existing } = await supabase
      .from('class_instances')
      .select(`
        *,
        class:classes(*)
      `)
      .eq('class_id', classId)
      .eq('class_date', classDate)
      .single()

    if (existing) {
      return existing
    }

    // If no existing instance, create one
    return await this.createClassInstance(classId, classDate)
  }

  // Update a class instance
  static async updateClassInstance(instanceId: string, updates: Partial<ClassInstance>): Promise<ClassInstance> {
    const { data, error } = await supabase
      .from('class_instances')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', instanceId)
      .select(`
        *,
        class:classes(*)
      `)
      .single()
    
    if (error) throw error
    return data
  }

  // Delete a class instance
  static async deleteClassInstance(instanceId: string): Promise<void> {
    const { error } = await supabase
      .from('class_instances')
      .delete()
      .eq('id', instanceId)
    
    if (error) throw error
  }

  // Get all class instances for admin management
  static async getAllClassInstances(startDate?: string, endDate?: string): Promise<ClassInstance[]> {
    let query = supabase
      .from('class_instances')
      .select(`
        *,
        class:classes(*)
      `)
      .order('class_date', { ascending: true })
      .order('created_at', { ascending: true })

    if (startDate) {
      query = query.gte('class_date', startDate)
    }
    if (endDate) {
      query = query.lte('class_date', endDate)
    }

    const { data, error } = await query
    
    if (error) throw error
    return data || []
  }

  // Initialize default classes (run once to set up the database)
  static async initializeDefaultClasses(): Promise<void> {
    const defaultClasses = [
      // Sunday classes
      {
        name: "Sunday Restore",
        teacher: "Harshada",
        day_of_week: 0,
        start_time: "09:00",
        duration: 60,
        level: "All Levels",
        max_students: 10
      },
      {
        name: "Sunset Flow",
        teacher: "Archana",
        day_of_week: 0,
        start_time: "17:00",
        duration: 60,
        level: "All Levels",
        max_students: 10
      },
      // Monday-Friday classes
      {
        name: "Morning Flow",
        teacher: "Harshada",
        day_of_week: 1,
        start_time: "08:00",
        duration: 60,
        level: "All Levels",
        max_students: 10
      },
      {
        name: "Evening Restore",
        teacher: "Archana",
        day_of_week: 1,
        start_time: "18:00",
        duration: 60,
        level: "All Levels",
        max_students: 10
      },
      // Tuesday
      {
        name: "Morning Flow",
        teacher: "Harshada",
        day_of_week: 2,
        start_time: "08:00",
        duration: 60,
        level: "All Levels",
        max_students: 10
      },
      {
        name: "Evening Restore",
        teacher: "Archana",
        day_of_week: 2,
        start_time: "18:00",
        duration: 60,
        level: "All Levels",
        max_students: 10
      },
      // Wednesday
      {
        name: "Morning Flow",
        teacher: "Harshada",
        day_of_week: 3,
        start_time: "08:00",
        duration: 60,
        level: "All Levels",
        max_students: 10
      },
      {
        name: "Evening Restore",
        teacher: "Archana",
        day_of_week: 3,
        start_time: "18:00",
        duration: 60,
        level: "All Levels",
        max_students: 10
      },
      // Thursday
      {
        name: "Morning Flow",
        teacher: "Harshada",
        day_of_week: 4,
        start_time: "08:00",
        duration: 60,
        level: "All Levels",
        max_students: 10
      },
      {
        name: "Evening Restore",
        teacher: "Archana",
        day_of_week: 4,
        start_time: "18:00",
        duration: 60,
        level: "All Levels",
        max_students: 10
      },
      // Friday
      {
        name: "Morning Flow",
        teacher: "Harshada",
        day_of_week: 5,
        start_time: "08:00",
        duration: 60,
        level: "All Levels",
        max_students: 10
      },
      {
        name: "Evening Restore",
        teacher: "Archana",
        day_of_week: 5,
        start_time: "18:00",
        duration: 60,
        level: "All Levels",
        max_students: 10
      },
      // Saturday classes
      {
        name: "Saturday Flow",
        teacher: "Harshada",
        day_of_week: 6,
        start_time: "09:00",
        duration: 60,
        level: "All Levels",
        max_students: 10
      },
      {
        name: "Weekend Restore",
        teacher: "Archana",
        day_of_week: 6,
        start_time: "17:00",
        duration: 60,
        level: "All Levels",
        max_students: 10
      }
    ]

    // Check if classes already exist
    const { data: existingClasses } = await supabase
      .from('classes')
      .select('id')
      .limit(1)

    if (existingClasses && existingClasses.length > 0) {
      console.log('Classes already exist, skipping initialization')
      return
    }

    // Insert default classes
    const { error } = await supabase
      .from('classes')
      .insert(defaultClasses.map(cls => ({
        ...cls,
        is_active: true
      })))

    if (error) {
      console.error('Error initializing classes:', error)
      throw error
    }

    console.log('✅ Default classes initialized successfully')
  }
}