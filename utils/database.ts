import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database schemas
export interface ClassBooking {
  id: string
  student_name: string
  student_email: string
  class_name: string
  teacher: string
  class_date: string
  class_time: string
  payment_method: string
  amount: number
  zoom_meeting_id?: string
  zoom_password?: string
  zoom_link?: string
  created_at: string
  updated_at: string
}

export interface ClassPackage {
  id: string
  student_email: string
  package_type: 'five' | 'ten'
  total_classes: number
  remaining_classes: number
  created_at: string
  updated_at: string
}

export interface ZoomMeeting {
  id: string
  class_name: string
  teacher: string
  class_date: string
  class_time: string
  meeting_id: string
  password: string
  join_url: string
  created_at: string
}

// Database operations
export class DatabaseService {
  // Bookings
  static async createBooking(booking: Omit<ClassBooking, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('class_bookings')
      .insert([booking])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getBookings() {
    const { data, error } = await supabase
      .from('class_bookings')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async getBookingsByClass(className: string) {
    const { data, error } = await supabase
      .from('class_bookings')
      .select('*')
      .eq('class_name', className)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  // Packages
  static async createPackage(packageData: Omit<ClassPackage, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('class_packages')
      .insert([packageData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getStudentPackages(email: string) {
    const { data, error } = await supabase
      .from('class_packages')
      .select('*')
      .eq('student_email', email)
    
    if (error) throw error
    return data
  }

  static async usePackageClass(email: string, packageType: 'five' | 'ten') {
    // First get the current package
    const { data: packages, error: fetchError } = await supabase
      .from('class_packages')
      .select('*')
      .eq('student_email', email)
      .eq('package_type', packageType)
      .gt('remaining_classes', 0)
      .single()
    
    if (fetchError) throw fetchError
    
    // Update the remaining classes
    const { data, error } = await supabase
      .from('class_packages')
      .update({ remaining_classes: packages.remaining_classes - 1 })
      .eq('id', packages.id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Zoom Meetings
  static async createZoomMeeting(meeting: Omit<ZoomMeeting, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('zoom_meetings')
      .insert([meeting])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getZoomMeeting(className: string, teacher: string, date: string, time: string) {
    const { data, error } = await supabase
      .from('zoom_meetings')
      .select('*')
      .eq('class_name', className)
      .eq('teacher', teacher)
      .eq('class_date', date)
      .eq('class_time', time)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }
}
