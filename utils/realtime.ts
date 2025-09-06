import { supabase } from './database'

export class RealtimeService {
  static subscribeToBookings(callback: (booking: any) => void) {
    return supabase
      .channel('class_bookings')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'class_bookings' }, 
        callback
      )
      .subscribe()
  }

  static subscribeToPackages(callback: (packageData: any) => void) {
    return supabase
      .channel('class_packages')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'class_packages' }, 
        callback
      )
      .subscribe()
  }
}
