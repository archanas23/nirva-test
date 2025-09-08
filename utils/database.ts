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

  // User data persistence methods
  static async createOrUpdateUser(userData: { email: string; name?: string }) {
    const { data, error } = await supabase
      .from('users')
      .upsert([{
        email: userData.email,
        name: userData.name || null,
        updated_at: new Date().toISOString()
      }], {
        onConflict: 'email'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getUserCredits(userId: string) {
    console.log('💰 DatabaseService.getUserCredits called with userId:', userId);
    
    const { data, error } = await supabase
      .from('user_class_credits')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('💰 Database getUserCredits error:', JSON.stringify(error, null, 2));
      throw new Error(`Database error: ${JSON.stringify(error)}`);
    }
    
    console.log('💰 Database getUserCredits success:', data);
    return data
  }

  static async updateUserCredits(userId: string, credits: { single_classes: number; five_pack_classes: number; ten_pack_classes: number }) {
    const { data, error } = await supabase
      .from('user_class_credits')
      .upsert([{
        user_id: userId,
        single_classes: credits.single_classes,
        five_pack_classes: credits.five_pack_classes,
        ten_pack_classes: credits.ten_pack_classes,
        updated_at: new Date().toISOString()
      }], {
        onConflict: 'user_id'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getUserBookedClasses(userId: string) {
    console.log('📚 DatabaseService.getUserBookedClasses called with userId:', userId);
    
    const { data, error } = await supabase
      .from('user_booked_classes')
      .select('*')
      .eq('user_id', userId)
      .eq('is_cancelled', false)
      .order('booked_at', { ascending: false })
    
    if (error) {
      console.error('📚 Database getUserBookedClasses error:', JSON.stringify(error, null, 2));
      throw new Error(`Database error: ${JSON.stringify(error)}`);
    }
    
    console.log('📚 Database getUserBookedClasses success:', data);
    return data || []
  }

  static async bookClass(userId: string, classData: {
    class_name: string;
    teacher: string;
    class_date: string;
    class_time: string;
    zoom_meeting_id?: string;
    zoom_password?: string;
    zoom_link?: string;
  }) {
    console.log('💾 DatabaseService.bookClass called with:', { userId, classData });
    
    const { data, error } = await supabase
      .from('user_booked_classes')
      .insert([{
        user_id: userId,
        ...classData,
        booked_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) {
      console.error('💾 Database booking error:', error);
      throw error;
    }
    
    console.log('💾 Database booking success:', data);
    return data
  }

  static async cancelClass(userId: string, classData: {
    class_name: string;
    class_date: string;
    class_time: string;
  }) {
    const { data, error } = await supabase
      .from('user_booked_classes')
      .update({
        is_cancelled: true,
        cancelled_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('class_name', classData.class_name)
      .eq('class_date', classData.class_date)
      .eq('class_time', classData.class_time)
      .eq('is_cancelled', false)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}
