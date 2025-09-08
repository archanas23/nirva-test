import axios from 'axios'
import { DatabaseService } from './database'

export interface ZoomMeeting {
  meeting_id: string
  password: string
  join_url: string
  start_time: string
  duration: number
}

export interface ClassMeeting {
  classId: string
  className: string
  teacher: string
  date: string
  time: string
  duration: number
  zoomMeeting: ZoomMeeting
}

export class ZoomService {
  static async createClassMeeting(
    className: string,
    teacher: string,
    date: string,
    time: string,
    duration: number = 60
  ): Promise<ClassMeeting | null> {
    try {
      console.log('🎥 Creating Zoom meeting via Netlify function...')
      
      const response = await fetch('/.netlify/functions/create-zoom-meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          className,
          teacher,
          date,
          time,
          duration
        })
      })

      const result = await response.json()
      
      if (result.success && result.meeting) {
        console.log('✅ Zoom meeting created successfully')
        return {
          classId: result.meeting.meeting_id,
          className,
          teacher,
          date,
          time,
          duration,
          zoomMeeting: {
            meeting_id: result.meeting.meeting_id,
            password: result.meeting.password,
            join_url: result.meeting.join_url,
            start_time: result.meeting.start_time,
            duration: result.meeting.duration
          }
        }
      } else {
        console.error('❌ Failed to create Zoom meeting:', result.error)
        return null
      }
    } catch (error) {
      console.error('❌ Failed to create Zoom meeting:', error)
      return null
    }
  }

  static async createMeeting(
    className: string,
    teacher: string,
    date: string,
    time: string,
    duration: number = 60
  ): Promise<ZoomMeeting | null> {
    try {
      console.log('🎥 Creating Zoom meeting via Netlify function...')
      
      const response = await fetch('/.netlify/functions/create-zoom-meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          className,
          teacher,
          date,
          time,
          duration
        })
      })

      const result = await response.json()
      
      if (result.success && result.meeting) {
        console.log('✅ Zoom meeting created successfully')
        return {
          meeting_id: result.meeting.meeting_id,
          password: result.meeting.password,
          join_url: result.meeting.join_url,
          start_time: result.meeting.start_time,
          duration: result.meeting.duration
        }
      } else {
        console.error('❌ Failed to create Zoom meeting:', result.error)
        return null
      }
    } catch (error) {
      console.error('❌ Failed to create Zoom meeting:', error)
      return null
    }
  }
}
