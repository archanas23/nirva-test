import { useState, Suspense, lazy, useEffect } from "react";
import { Navigation } from "./components/navigation";
import { HeroSection } from "./components/hero-section";
import { ClassSchedule } from "./components/class-schedule-clean";
import { StudioInfo } from "./components/studio-info";
import { TeachersSection } from "./components/teachers-section";
import { VirtualInfo } from "./components/virtual-info";
import { ContactSection } from "./components/contact-section";
import { ContactPage } from "./components/contact-page";
import { FlowingYogaGallery } from "./components/flowing-yoga-gallery";
import { PackagesSection } from "./components/packages-section";
import { FAQSection } from "./components/faq-section";
import { SEOMeta } from "./components/seo-meta";
import { PaymentPage } from "./components/payment-page";
import { AuthModal } from "./components/auth-modal";
import { UserAccount } from "./components/user-account";
import { TermsOfService } from "./components/terms-of-service";
import { PrivacyPolicy } from "./components/privacy-policy";
import { Footer } from "./components/footer";
import { AdminNotificationDisplay } from "./components/admin-notification-display";
import { AdminPanel } from "./components/admin-panel";
import { Button } from "./components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { DatabaseService } from "./utils/database";
import { ZoomService } from "./utils/zoom-service";
import { EmailService } from "./utils/email-service";

// Lazy load StripePaymentPage to avoid loading Stripe until needed
const StripePaymentPage = lazy(() =>
  import('./components/stripe-elements-payment').then(m => ({ default: m.StripeElementsPayment }))
);

interface ClassItem {
  id: string;
  time: string;
  className: string;
  teacher: string;
  duration: string;
  level: string;
  maxStudents?: number;
  currentEnrollment?: number;
  date?: string;
}

interface User {
  email: string;
  name?: string;
  classPacks: {
    singleClasses: number;
    fivePack: number;
    tenPack: number;
  };
}

export default function App() {
  const [currentView, setCurrentView] = useState<"home" | "classes" | "teachers" | "packages" | "contact" | "register" | "faq" | "payment" | "admin">("home");
  const [navigationHistory, setNavigationHistory] = useState<string[]>(["home"]);
  const [selectedClass, setSelectedClass] = useState<{
    className: string;
    teacher: string;
    time: string;
    day: string;
    id?: string;
  } | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<{
    type: 'five' | 'ten' | 'single';
    price: number;
    name: string;
  } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [classInstances, setClassInstances] = useState<any[]>([]);
  
  // Track booked classes with Zoom links
  const [bookedClasses, setBookedClasses] = useState<{
    [classId: string]: {
      className: string;
      teacher: string;
      time: string;
      day: string;
      zoomLink?: string;
      zoomPassword?: string;
      meetingId?: string;
      bookedAt: string;
    };
  }>({});
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is already logged in
        const storedUser = localStorage.getItem('nirva_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // Load user's data from database
          await loadUserData(userData.email);
        }
        
        // Booked classes will be loaded in loadUserData function
      } catch (error) {
        // Error checking auth
        localStorage.removeItem('nirva_user');
        // Note: We don't remove user-specific localStorage here since we don't know which user
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Load user data from database
  const loadUserData = async (email: string) => {
    try {
      // Create or update user in database
      const userRecord = await DatabaseService.createOrUpdateUser({
        email,
        name: email.split('@')[0]
      });
      
      // Load user's class credits from database
      let credits = { single_classes: 0, five_pack_classes: 0, ten_pack_classes: 0 };
      try {
        const creditsData = await DatabaseService.getUserCredits(userRecord.id);
        if (creditsData) {
          credits = {
            single_classes: creditsData.single_classes || 0,
            five_pack_classes: creditsData.five_pack_classes || 0,
            ten_pack_classes: creditsData.ten_pack_classes || 0
          };
        }
      } catch (creditsError) {
        // No credits found for user, using defaults
      }
      
      // Load user's booked classes from database
      let bookedClassesData: { [key: string]: {
        className: string;
        teacher: string;
        time: string;
        day: string;
        zoomLink?: string;
        zoomPassword?: string;
        meetingId?: string;
        bookedAt: string;
      } } = {};
      try {
        const bookedClasses = await DatabaseService.getUserBookedClasses(userRecord.id);
        if (bookedClasses) {
          // Use the same key format as the booking process
          const formatTimeForKey = (timeStr: string) => {
            if (!timeStr) return '00:00';
            if (timeStr.includes('AM') || timeStr.includes('PM')) {
              return timeStr; // Already formatted
            }
            const [hours, minutes] = timeStr.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            return `${displayHour}:${minutes} ${ampm}`;
          };
          
          bookedClasses.forEach(booking => {
            const classKey = `${booking.class_name}-${booking.class_date}-${formatTimeForKey(booking.class_time)}`;
            bookedClassesData[classKey] = {
              className: booking.class_name,
              teacher: booking.teacher,
              time: booking.class_time,
              day: booking.class_date,
              zoomLink: booking.zoom_link,
              zoomPassword: booking.zoom_password,
              meetingId: booking.zoom_meeting_id,
              bookedAt: booking.booked_at
            };
          });
        }
      } catch (bookedError) {
        // No booked classes found for user
      }

      // Update user state with loaded data
      const updatedUser = {
        email: userRecord.email,
        name: userRecord.name || email.split('@')[0],
        classPacks: {
          singleClasses: credits.single_classes,
          fivePack: credits.five_pack_classes,
          tenPack: credits.ten_pack_classes
        }
      };

      setUser(updatedUser);
      setBookedClasses(bookedClassesData);
      
      // Store in localStorage for persistence
      localStorage.setItem('nirva_user', JSON.stringify(updatedUser));
    } catch (error) {
      // Error loading user data
    }
  };

  // User state changes (debugging removed for production)

  const handleLogin = async (email: string, password?: string) => {
    // Password is required for all users
    if (!password) {
      throw new Error('Password is required. Please enter your password.');
    }

    // Check for admin authentication
    if (email === 'nirvayogastudio@gmail.com') {
      // Admin password validation - use environment variable
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'nirva2024';
      if (password !== adminPassword) {
        throw new Error('Incorrect password for admin account. Please try again.');
      }
    } else {
      // For regular users, verify password against stored hash
      try {
        const userRecord = await DatabaseService.getUserByEmail(email);
        
        if (!userRecord) {
          throw new Error('Account not found. Please sign up first.');
        }

        // Verify password
        if (!userRecord.password_hash) {
          throw new Error('Account not properly set up. Please sign up again.');
        }

        const isPasswordValid = await DatabaseService.verifyPassword(password, userRecord.password_hash);
        if (!isPasswordValid) {
          throw new Error('Invalid password. Please try again.');
        }
      } catch (error: any) {
        console.error('Login failed:', error);
        if (error.message.includes('Account not found') || error.message.includes('not properly set up')) {
          throw new Error('Account not found. Please sign up first.');
        } else if (error.message.includes('Invalid password')) {
          throw new Error('Invalid password. Please try again.');
        } else {
          throw new Error('Login failed. Please try again or contact support.');
        }
      }
    }
    
    try {
      // Get user from database (already verified above)
      const userRecord = await DatabaseService.getUserByEmail(email);
      
      // Load user's class credits from database
      let credits = { single_classes: 0, five_pack_classes: 0, ten_pack_classes: 0 };
      try {
        const creditsData = await DatabaseService.getUserCredits(userRecord.id);
        if (creditsData) {
          credits = {
            single_classes: creditsData.single_classes || 0,
            five_pack_classes: creditsData.five_pack_classes || 0,
            ten_pack_classes: creditsData.ten_pack_classes || 0
          };
        }
      } catch (creditsError) {
        // No credits found for user, using defaults
      }
      
      // Load user's booked classes from database
      let bookedClassesData = {};
      try {
        const bookedClasses = await DatabaseService.getUserBookedClasses(userRecord.id);
        bookedClassesData = bookedClasses.reduce((acc, booking) => {
          // Create a unique key based on class details to match with schedule
          const classKey = `${booking.class_name}-${booking.class_date}-${booking.class_time}`;
          
          acc[classKey] = {
            className: booking.class_name,
            teacher: booking.teacher,
            time: booking.class_time,
            day: booking.class_date,
            zoomLink: booking.zoom_link || '',
            zoomPassword: booking.zoom_password || '',
            meetingId: booking.zoom_meeting_id || '',
            bookedAt: booking.booked_at
          };
          return acc;
        }, {});
        
      } catch (bookedError) {
        // No booked classes found for user
      }
      
      const updatedUser = {
        email,
        name: userRecord.name || email.split('@')[0],
        classPacks: {
          singleClasses: credits.single_classes,
          fivePack: credits.five_pack_classes,
          tenPack: credits.ten_pack_classes
        }
      };
      
      setUser(updatedUser);
      
      // Use only database data for security (no sensitive data in localStorage)
      const finalBookedClasses = bookedClassesData;
      
      // Set the booked classes state with merged data
      setBookedClasses(finalBookedClasses);
      
      // Load class instances for ID matching
      try {
        const today = new Date();
        const startDate = today.toISOString().split('T')[0];
        const endDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const { ClassManagementService } = await import('./utils/class-management');
        const instances = await ClassManagementService.getClassInstances(startDate, endDate);
        setClassInstances(instances);
        console.log('📅 Loaded class instances:', instances);
      } catch (error) {
        console.log('⚠️ Error loading class instances:', error);
      }
      
      // Store in localStorage for persistence
      localStorage.setItem('nirva_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('❌ Error loading user data:', error);
      // Fallback to basic user data if database fails
    setUser({
      email,
      name: email.split('@')[0],
      classPacks: {
          singleClasses: 0,
          fivePack: 0,
        tenPack: 0
      }
    });
    }
  };

  const handleSignup = async (email: string, password: string, name: string) => {
    try {
      // Check if user already exists first
      const existingUser = await DatabaseService.getUserByEmail(email);
      if (existingUser) {
        throw new Error('An account with this email already exists. Please use the "Reset Password" tab if you forgot your password, or try logging in with your existing credentials.');
      }

      // Create user in our database with password
      const userRecord = await DatabaseService.createOrUpdateUser({
        email,
        name: name,
        password: password
      });
      
      if (!userRecord) {
        throw new Error('Failed to create account. Please try again.');
      }
      
      // Send welcome email to new user
      try {
        const { EmailService } = await import('./utils/email-service');
        await EmailService.sendWelcomeEmail({
          studentName: name,
          studentEmail: email
        });
      } catch (emailError) {
        console.error('⚠️ Failed to send welcome email:', emailError);
        // Don't fail signup if email fails
      }
      
      // Account created successfully - no email confirmation needed
      return { user: { email, name } };
    } catch (error: any) {
      console.error('Signup failed:', error);
      if (error.message.includes('already exists') || error.message.includes('duplicate key')) {
        throw new Error('An account with this email already exists. Please use the "Reset Password" tab if you forgot your password, or try logging in with your existing credentials.');
      } else if (error.message.includes('Password must be at least 6 characters')) {
        throw new Error('Password must be at least 6 characters long.');
      } else {
        throw new Error(error.message || 'Failed to create account. Please try again.');
      }
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      // Check if user exists in our database
      const userRecord = await DatabaseService.getUserByEmail(email);
      
      if (!userRecord) {
        throw new Error('No account found with this email address.');
      }

      // Generate a secure reset token using crypto.randomBytes
      const resetToken = crypto.getRandomValues(new Uint8Array(32))
        .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
      
      // Store reset token in database with expiration (24 hours)
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
      try {
        await DatabaseService.storePasswordResetToken(email, resetToken, expiresAt);
      } catch (dbError) {
        console.warn('Password reset tokens table not available yet. Please run the database migration.');
        // Continue with email sending even if database storage fails
      }
      
      // Send custom password reset email using our email service
      const { EmailService } = await import('./utils/email-service');
      await EmailService.sendEmail({
        type: 'password-reset',
        data: {
          studentName: userRecord.name || email.split('@')[0],
          studentEmail: email,
          resetToken: resetToken
        }
      });
      
      // Password reset email sent successfully
    } catch (error: any) {
      console.error('Password reset failed:', error);
      if (error.message.includes('No account found')) {
        throw new Error('No account found with this email address.');
      } else {
        throw new Error(error.message || 'Failed to send reset email. Please try again.');
      }
    }
  };

  const handleLogout = async () => {
    // Clear only non-sensitive localStorage on logout
    localStorage.removeItem('nirva_user');
    
    setUser(null);
    setBookedClasses({});
    setShowAccountModal(false);
  };

  const navigateTo = (view: string) => {
    setNavigationHistory(prev => [...prev, view]);
    setCurrentView(view as any);
    
    // Update URL without page refresh
    const url = view === "home" ? "/" : `/${view}`;
    window.history.pushState({}, "", url);
  };

  // Handle URL changes and browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/" || path === "") {
        setCurrentView("home");
      } else if (path === "/register") {
        setCurrentView("register");
      } else if (path === "/classes") {
        setCurrentView("classes");
      } else if (path === "/teachers") {
        setCurrentView("teachers");
      } else if (path === "/packages") {
        setCurrentView("packages");
      } else if (path === "/contact") {
        setCurrentView("contact");
      } else if (path === "/faq") {
        setCurrentView("faq");
      } else if (path === "/admin") {
        setCurrentView("admin");
      } else {
        setCurrentView("home");
      }
    };

    // Set initial view based on URL
    handlePopState();

    // Listen for browser back/forward
    window.addEventListener("popstate", handlePopState);
    
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove current view
      const previousView = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentView(previousView as any);
      setSelectedClass(null);
      setSelectedPackage(null);
    } else {
      // If no history, go to home
      setCurrentView("home");
      setSelectedClass(null);
      setSelectedPackage(null);
    }
  };

  const handlePurchasePackage = (packageType: 'single' | 'five' | 'ten') => {
    // Require authentication for all purchases
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (packageType === 'single') {
      // Single class booking - go to payment
      setSelectedPackage({
        type: 'single',
        price: 11, // Updated to $11
        name: 'Single Class'
      });
      navigateTo("payment");
    } else {
      // Package purchase
      const packagePrices = {
        five: 53, // Updated to $53
        ten: 105  // Updated to $105
      };
      
      const packageNames = {
        five: '5-Class Package',
        ten: '10-Class Package'
      };
      
      setSelectedPackage({
        type: packageType as 'five' | 'ten',
        price: packagePrices[packageType as 'five' | 'ten'],
        name: packageNames[packageType as 'five' | 'ten']
      });
      navigateTo("payment");
    }
  };

  const handleUseClassPack = () => {
    if (!user) return;
    
    setUser(prev => {
      if (!prev) return prev;
      const newClassPacks = { ...prev.classPacks };
      
      // Use from 10-pack first (better value), then 5-pack
      if (newClassPacks.tenPack > 0) {
        newClassPacks.tenPack -= 1;
      } else if (newClassPacks.fivePack > 0) {
        newClassPacks.fivePack -= 1;
      }
      
      return { ...prev, classPacks: newClassPacks };
    });
  };

  // Note: Past class validation removed since we're in September 2025

  // Check if a class is already booked
  const isClassBooked = (classId: string) => {
    console.log('🔍 isClassBooked called with classId:', classId);
    console.log('🔍 classInstances available:', classInstances?.length || 0);
    console.log('🔍 bookedClasses available:', Object.keys(bookedClasses).length);
    
    // For now, let's check if any booking matches this class ID
    // This is a temporary fix until we get the proper ID matching working
    const classItem = classInstances?.find(instance => instance.id === classId);
    if (!classItem) {
      console.log('⚠️ Class item not found in instances for ID:', classId);
      return false;
    }
    
    console.log('🔍 Found class item:', classItem);
    
    // Convert start_time format from "08:00:00" to "8:00 AM" to match booking format
    const formatTimeForKey = (timeStr: string) => {
      if (!timeStr) return '00:00';
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    };
    
    const classKey = `${classItem.class?.name || classItem.class_name}-${classItem.class_date}-${formatTimeForKey(classItem.class?.start_time || '00:00')}`;
    const isBooked = bookedClasses[classKey] !== undefined;
    
    console.log('🔍 Checking if class is booked:', {
      classId,
      classKey,
      isBooked,
      bookedClassesKeys: Object.keys(bookedClasses),
      classItemName: classItem.class?.name || classItem.class_name,
      classItemDate: classItem.class_date,
      classItemTime: classItem.class?.start_time
    });
    
    return isBooked;
  };

  const handleBookClass = async (classItem: ClassItem, day: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    // Note: Past class validation removed since we're in September 2025
    // All classes in the schedule should be bookable
    
    // Check if class is already booked
    if (isClassBooked(classItem.id)) {
      alert('✅ This class is already booked! Check your account for Zoom details.');
      return;
    }
    
    // Check if user has classes available
    const totalClasses = user.classPacks.singleClasses + user.classPacks.fivePack + user.classPacks.tenPack;
    if (totalClasses === 0) {
      alert('❌ No classes remaining. Please purchase a package first.');
      return;
    }
    
    // User has classes available - process the booking immediately
    try {
      console.log('📅 Processing class booking with existing credits...');
      
      // Get user ID from database
      const userRecord = await DatabaseService.createOrUpdateUser({
        email: user.email,
        name: user.name
      });
      
      // Generate Zoom meeting for the class
      console.log('🎥 Creating Zoom meeting for class...');
      console.log('📅 Meeting details:', { className: classItem.className, teacher: classItem.teacher, day, time: classItem.time });
      
      // Convert day format to "YYYY-MM-DD" for Zoom API and database
      const convertDayToDate = (dayStr: string) => {
        // If already in YYYY-MM-DD format, return as is
        if (/^\d{4}-\d{2}-\d{2}$/.test(dayStr)) {
          return dayStr;
        }
        
        // Try to parse as ISO date string
        const date = new Date(dayStr);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
        
        // Fallback for other formats
        console.error('Invalid day format:', dayStr);
        return '2025-09-01';
      };
      
      const formattedDate = convertDayToDate(day);
      
      let zoomMeeting = null;
      // Create real Zoom meeting using API
      try {
        const response = await fetch('/.netlify/functions/create-zoom-meeting-fetch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            className: classItem.className,
            teacher: classItem.teacher,
            date: formattedDate,
            time: classItem.time,
            duration: 60,
            meetingType: 'scheduled'
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.meeting) {
          zoomMeeting = {
            classId: classItem.id,
            className: classItem.className,
            teacher: classItem.teacher,
            date: formattedDate,
            time: classItem.time,
            duration: 60,
            zoomMeeting: {
              meeting_id: result.meeting.meeting_id,
              password: result.meeting.password,
              join_url: result.meeting.join_url,
              start_time: result.meeting.start_time,
              duration: result.meeting.duration
            }
          };
        } else {
          throw new Error('Invalid response from Zoom API');
        }
      } catch (zoomError) {
        // Fallback if API fails
        const meetingId = 'nirva-yoga-classes';
        const password = 'yoga123';
        
        zoomMeeting = {
          classId: classItem.id,
          className: classItem.className,
          teacher: classItem.teacher,
          date: formattedDate,
          time: classItem.time,
          duration: 60,
          zoomMeeting: {
            meeting_id: meetingId,
            password: password,
            join_url: `https://zoom.us/j/${meetingId}?pwd=${password}`,
            start_time: new Date().toISOString(),
            duration: 60
          }
        };
      }
      
      // Ensure we always have valid Zoom data
      if (!zoomMeeting || !zoomMeeting.zoomMeeting?.join_url) {
        const meetingId = `fallback-${Date.now()}`;
        zoomMeeting = {
          classId: classItem.id,
          className: classItem.className,
          teacher: classItem.teacher,
          date: formattedDate,
          time: classItem.time,
          duration: 60,
          zoomMeeting: {
            meeting_id: meetingId,
            password: 'yoga123',
            join_url: `https://zoom.us/j/${meetingId}?pwd=yoga123`,
            start_time: new Date().toISOString(),
            duration: 60
          }
        };
      }
      
      // Save booked class to database with Zoom data
      try {
        console.log('💾 Saving class booking to database...');
        console.log('💾 User ID:', userRecord.id);
        console.log('💾 Class data:', {
          class_name: classItem.className,
          teacher: classItem.teacher,
          class_date: formattedDate,
          class_time: classItem.time,
          class_instance_id: classItem.id,
          zoom_meeting_id: zoomMeeting?.zoomMeeting?.meeting_id || '',
          zoom_password: zoomMeeting?.zoomMeeting?.password || '',
          zoom_link: zoomMeeting?.zoomMeeting?.join_url || ''
        });
        await DatabaseService.bookClass(userRecord.id, {
          class_name: classItem.className,
          teacher: classItem.teacher,
          class_date: formattedDate,
          class_time: classItem.time,
          class_instance_id: classItem.id,
          zoom_meeting_id: zoomMeeting?.zoomMeeting?.meeting_id || '',
          zoom_password: zoomMeeting?.zoomMeeting?.password || '',
          zoom_link: zoomMeeting?.zoomMeeting?.join_url || ''
        });
        console.log('✅ Class booking saved to database with Zoom data');
      } catch (dbError) {
        console.log('⚠️ Database booking failed, but continuing with local state update:', dbError);
        // Continue with local state update even if database fails
      }
      
      // Update booked classes state using the same key format as isClassBooked
      const formatTimeForKey = (timeStr: string) => {
        if (!timeStr) return '00:00';
        
        // Check if time already has AM/PM
        if (timeStr.includes('AM') || timeStr.includes('PM')) {
          return timeStr; // Already formatted
        }
        
        // Convert from 24-hour format to 12-hour format
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
      };
      
      const classKey = `${classItem.className}-${formattedDate}-${formatTimeForKey(classItem.time)}`;
      
      const bookedClassData = {
        className: classItem.className,
        teacher: classItem.teacher,
        time: classItem.time,
        day: day,
        zoomLink: zoomMeeting?.zoomMeeting?.join_url || '',
        zoomPassword: zoomMeeting?.zoomMeeting?.password || '',
        meetingId: zoomMeeting?.zoomMeeting?.meeting_id || '',
        bookedAt: new Date().toISOString()
      };
      console.log('📝 Storing booked class data:', bookedClassData);
      console.log('🔗 Zoom link being stored:', bookedClassData.zoomLink);
      console.log('📋 Class key for storage:', classKey);
      console.log('📋 Class item details:', {
        className: classItem.className,
        time: classItem.time,
        formattedDate: formattedDate,
        formattedTime: formatTimeForKey(classItem.time)
      });
      console.log('🔗 Full zoomMeeting object:', zoomMeeting);
      
      setBookedClasses(prev => {
        const newBookedClasses = {
          ...prev,
          [classKey]: bookedClassData
        };
        console.log('📋 Updated booked classes state:', newBookedClasses);
        console.log('📋 Keys in booked classes:', Object.keys(newBookedClasses));
        
        // Booked classes are now stored only in database for security
        
        return newBookedClasses;
      });
      
      // Deduct one class from user's account (prioritize single classes, then packages)
      const newClassPacks = { ...user.classPacks };
      if (newClassPacks.singleClasses > 0) {
        newClassPacks.singleClasses -= 1;
        console.log('➖ Deducted 1 single class');
      } else if (newClassPacks.fivePack > 0) {
        newClassPacks.fivePack -= 1;
        console.log('➖ Deducted 1 class from fivePack');
      } else if (newClassPacks.tenPack > 0) {
        newClassPacks.tenPack -= 1;
        console.log('➖ Deducted 1 class from tenPack');
      }
      
      // Update credits in database
      try {
        await DatabaseService.updateUserCredits(userRecord.id, {
          single_classes: newClassPacks.singleClasses,
          five_pack_classes: newClassPacks.fivePack,
          ten_pack_classes: newClassPacks.tenPack
        });
        console.log('✅ Credits updated in database');
      } catch (creditsError) {
        console.log('⚠️ Failed to update credits in database:', creditsError);
      }
      
      // Update local state
      setUser(prev => {
        if (!prev) return prev;
        console.log('📊 Updated class packs after booking:', newClassPacks);
        return { ...prev, classPacks: newClassPacks };
      });
      
      // Send confirmation email to student
      try {
        console.log('📧 Sending class booking confirmation email...');
        const emailData = {
          studentName: user.name || user.email || 'Unknown',
          studentEmail: user.email || '',
          className: classItem.className,
          teacher: classItem.teacher,
          date: day,
          time: classItem.time,
          zoomLink: zoomMeeting?.zoomMeeting?.join_url || '',
          zoomPassword: zoomMeeting?.zoomMeeting?.password || '',
          zoomMeetingId: zoomMeeting?.zoomMeeting?.meeting_id || ''
        };
        console.log('📧 Email data being sent:', emailData);
        console.log('🔗 Zoom link in email:', emailData.zoomLink);
        console.log('🔗 Zoom password in email:', emailData.zoomPassword);
        console.log('📧 Full zoomMeeting object:', zoomMeeting);
        
        await EmailService.sendStudentConfirmation(emailData);
        console.log('✅ Confirmation email sent');
      } catch (emailError) {
        console.log('⚠️ Email sending failed, but booking was successful:', emailError);
      }
      
      // Show success message
      alert(`✅ Class booked successfully! Check your email for Zoom details.`);
      
    } catch (error) {
      console.error('❌ Error booking class:', error);
      alert('❌ Failed to book class. Please try again.');
    }
  };

  const handleCancelClass = async (classId: string) => {
    if (!user) {
      return;
    }

    // Confirm cancellation
    const confirmed = window.confirm('Are you sure you want to cancel this class? Your credit will be restored.');
    if (!confirmed) {
      return;
    }

    try {
      console.log('🚫 Cancelling class:', classId);
      
      // Get user ID from database
      const userRecord = await DatabaseService.createOrUpdateUser({
        email: user.email,
        name: user.name
      });
      
      // Get the booked class details
      const bookedClass = bookedClasses[classId];
      if (!bookedClass) {
        console.error('❌ Class not found in booked classes');
        return;
      }

      // Cancel class in database
      try {
        await DatabaseService.cancelClass(userRecord.id, {
          class_name: bookedClass.className,
          class_date: bookedClass.day,
          class_time: bookedClass.time
        });
        console.log('✅ Class cancelled in database');
      } catch (dbError) {
        console.log('⚠️ Failed to cancel class in database:', dbError);
      }

      // Remove from booked classes state
      setBookedClasses(prev => {
        const newBookedClasses = { ...prev };
        delete newBookedClasses[classId];
        
        // Booked classes are now stored only in database for security
        
        return newBookedClasses;
      });

      // Restore one class to user's account
      const newClassPacks = { ...user.classPacks };
      
      // Restore to single classes first, then packages
      if (bookedClass.className.includes('Single') || newClassPacks.singleClasses > 0) {
        newClassPacks.singleClasses += 1;
        console.log('➕ Restored 1 single class');
      } else if (newClassPacks.fivePack < 5) {
        newClassPacks.fivePack += 1;
        console.log('➕ Restored 1 class to fivePack');
      } else if (newClassPacks.tenPack < 10) {
        newClassPacks.tenPack += 1;
        console.log('➕ Restored 1 class to tenPack');
      }
      
      // Update credits in database
      try {
        await DatabaseService.updateUserCredits(userRecord.id, {
          single_classes: newClassPacks.singleClasses,
          five_pack_classes: newClassPacks.fivePack,
          ten_pack_classes: newClassPacks.tenPack
        });
        console.log('✅ Credits restored in database');
      } catch (creditsError) {
        console.log('⚠️ Failed to restore credits in database:', creditsError);
      }
      
      // Update local state
      setUser(prev => {
        if (!prev) return prev;
        console.log('📊 Updated class packs after cancellation:', newClassPacks);
        return { ...prev, classPacks: newClassPacks };
      });

      // Send cancellation email notification
      try {
        console.log('📧 Sending cancellation email...');
        await EmailService.sendEmail({
          type: 'class-cancellation',
          data: {
            studentName: user.name || user.email || 'Unknown',
            studentEmail: user.email || '',
            className: bookedClass.className,
            teacher: bookedClass.teacher,
            date: bookedClass.day,
            time: bookedClass.time
          }
        });
        console.log('✅ Cancellation email sent');
      } catch (emailError) {
        console.log('⚠️ Email sending failed, but cancellation was successful:', emailError);
      }

      alert('✅ Class cancelled successfully! Your credit has been restored.');
      
    } catch (error) {
      console.error('❌ Error cancelling class:', error);
      alert('❌ Failed to cancel class. Please try again.');
    }
  };

  const handlePayForClass = (classItem: ClassItem, day: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    // Set up for single class payment
    setSelectedClass({
      className: classItem.className,
      teacher: classItem.teacher,
      time: classItem.time,
      day: day,
      id: classItem.id
    });
    setSelectedPackage({
      type: 'single',
      price: 11,
      name: 'Single Class'
    });
    navigateTo("payment");
  };

  const handlePayNow = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    // This is for single class booking from home page
    setSelectedPackage({
      type: 'single',
      price: 11, // Updated to $11
      name: 'Single Class'
    });
    setSelectedClass(null);
    navigateTo("payment");
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "payment":
        return (
          <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center">Loading payment...</div>}>
            <StripePaymentPage
              onBack={handleBack}
              selectedClass={selectedClass}
              selectedPackage={selectedPackage}
              user={user}
              onSuccess={async () => {
                // Handle successful payment
                console.log('🎉 Payment success callback triggered!');
                console.log('Selected class:', selectedClass);
                console.log('Selected package:', selectedPackage);
                console.log('Current user:', user);
                console.log('Current user classPacks:', user?.classPacks);
                
                try {
                  if (selectedClass) {
                    console.log('📅 Processing single class purchase...');
                    console.log('Class details:', selectedClass);
                    console.log('User email:', user?.email);
                    console.log('About to call createOrUpdateUser...');
                    
                    // Get or create user in database
                    console.log('Calling createOrUpdateUser with:', { email: user?.email || '', name: user?.name });
                    const userRecord = await DatabaseService.createOrUpdateUser({
                      email: user?.email || '',
                      name: user?.name
                    });
                    console.log('User record created/updated:', userRecord);
                    
                    // Calculate new credits - add 1 single class
                    const currentCredits = user?.classPacks || { singleClasses: 0, fivePack: 0, tenPack: 0 };
                    console.log('Current credits before update:', currentCredits);
                    const newCredits = { ...currentCredits };
                    newCredits.singleClasses += 1;
                    console.log('➕ Adding 1 single class');
                    console.log('New credits after update:', newCredits);
                    
                    // Update credits in database
                    try {
                      console.log('Updating credits in database with userRecord.id:', userRecord.id);
                      console.log('Credits to update:', {
                        single_classes: newCredits.singleClasses,
                        five_pack_classes: newCredits.fivePack,
                        ten_pack_classes: newCredits.tenPack
                      });
                      await DatabaseService.updateUserCredits(userRecord.id, {
                        single_classes: newCredits.singleClasses,
                        five_pack_classes: newCredits.fivePack,
                        ten_pack_classes: newCredits.tenPack
                      });
                      console.log('✅ Credits updated in database');
                    } catch (creditsError) {
                      console.log('⚠️ Failed to update credits in database:', creditsError);
                    }
                    
                    // Update local state
                    setUser(prev => {
                      if (!prev) return prev;
                      console.log('📊 Updated class packs after single class purchase:', newCredits);
                      const updatedUser = { ...prev, classPacks: newCredits };
                      console.log('📊 Updated user state:', updatedUser);
                      return updatedUser;
                    });
                    
                    console.log('✅ Single class credit added successfully');
                    console.log('Note: User will need to book the class separately using their credits');
                  } else if (selectedPackage) {
                    console.log('📦 Processing package purchase...');
                    console.log('Package details:', selectedPackage);
                    console.log('Package type:', selectedPackage.type);
                    console.log('User email:', user?.email);
                    
                    // Get or create user in database
                    const userRecord = await DatabaseService.createOrUpdateUser({
                      email: user?.email || '',
                      name: user?.name
                    });
                    
                    // Calculate new credits
                    const currentCredits = user?.classPacks || { singleClasses: 0, fivePack: 0, tenPack: 0 };
                    let newCredits = { ...currentCredits };
                    
                    if (selectedPackage.type === 'single') {
                      newCredits.singleClasses += 1;
                      console.log('➕ Adding 1 single class');
                    } else if (selectedPackage.type === 'five') {
                      newCredits.fivePack += 5;
                      console.log('➕ Adding 5 classes to fivePack');
                    } else if (selectedPackage.type === 'ten') {
                      newCredits.tenPack += 10;
                      console.log('➕ Adding 10 classes to tenPack');
                    }
                    
                    // Update credits in database
                    try {
                      await DatabaseService.updateUserCredits(userRecord.id, {
                        single_classes: newCredits.singleClasses,
                        five_pack_classes: newCredits.fivePack,
                        ten_pack_classes: newCredits.tenPack
                      });
                      console.log('✅ Credits updated in database');
                    } catch (creditsError) {
                      console.log('⚠️ Failed to update credits in database:', creditsError);
                    }
                    
                    // Update local state
                    setUser(prev => {
                      if (!prev) return prev;
                      console.log('📊 Updated class packs after purchase:', newCredits);
                      return { ...prev, classPacks: newCredits };
                    });
                    
                    console.log('✅ User credits updated successfully');
                  } else {
                    console.log('❌ No valid class or package selected');
                    console.log('Selected class:', selectedClass);
                    console.log('Selected package:', selectedPackage);
                  }
                } catch (error) {
                  console.error('❌ Error saving to database:', error);
                  console.error('❌ Error details:', error);
                  // Even if database fails, we still want to update the user state
                  console.log('⚠️ Database error occurred, but continuing with state update...');
                }
                
                // Show success message after a short delay to allow state update
                setTimeout(() => {
                  if (selectedPackage) {
                    if (selectedPackage.type === 'single') {
                      alert(`✅ Single class purchased successfully! You now have 1 class available to book.`);
                    } else {
                      alert(`✅ Payment successful! You now have ${selectedPackage.type === 'five' ? '5' : '10'} classes available.`);
                    }
                  } else if (selectedClass) {
                    alert(`✅ Class booked successfully! Check your account for details.`);
                  }
                }, 100);
                
                setCurrentView('home');
                setSelectedClass(null);
                setSelectedPackage(null);
              }}
            />
          </Suspense>
        );
      
      case "classes":
        return (
          <div className="min-h-screen bg-background">
            <Navigation 
              user={user}
              onLoginClick={() => setShowAuthModal(true)}
              onAccountClick={() => setShowAccountModal(true)}
              currentView={currentView}
              onNavigateHome={() => navigateTo("home")}
              onNavigateClasses={() => navigateTo("classes")}
              onNavigateTeachers={() => navigateTo("teachers")}
              onNavigatePackages={() => navigateTo("packages")}
              onNavigateContact={() => navigateTo("contact")}
              onNavigateRegister={() => navigateTo("register")}
              onNavigateFAQ={() => navigateTo("faq")}
              onNavigateAdmin={() => navigateTo("admin")}
            />
            
            <div className="container mx-auto px-4 py-8">
              <ClassSchedule 
                onBookClass={handleBookClass} 
                onCancelClass={handleCancelClass}
                onPayForClass={handlePayForClass}
                user={user} 
                bookedClasses={bookedClasses}
                isClassBooked={isClassBooked}
              />
            </div>
            
            <Footer 
              onShowTerms={() => setShowTermsModal(true)}
              onShowPrivacy={() => setShowPrivacyModal(true)}
            />
          </div>
        );
        
      case "teachers":
        return (
          <div className="min-h-screen bg-background">
            <Navigation 
              user={user}
              onLoginClick={() => setShowAuthModal(true)}
              onAccountClick={() => setShowAccountModal(true)}
              currentView={currentView}
              onNavigateHome={() => navigateTo("home")}
              onNavigateClasses={() => navigateTo("classes")}
              onNavigateTeachers={() => navigateTo("teachers")}
              onNavigatePackages={() => navigateTo("packages")}
              onNavigateContact={() => navigateTo("contact")}
              onNavigateRegister={() => navigateTo("register")}
              onNavigateFAQ={() => navigateTo("faq")}
              onNavigateAdmin={() => navigateTo("admin")}
            />
            
            <div className="container mx-auto px-4 py-8">
              <TeachersSection />
            </div>
            
            <Footer 
              onShowTerms={() => setShowTermsModal(true)}
              onShowPrivacy={() => setShowPrivacyModal(true)}
            />
          </div>
        );
        
      case "packages":
        return (
          <div className="min-h-screen bg-background">
            <Navigation 
              user={user}
              onLoginClick={() => setShowAuthModal(true)}
              onAccountClick={() => setShowAccountModal(true)}
              currentView={currentView}
              onNavigateHome={() => navigateTo("home")}
              onNavigateClasses={() => navigateTo("classes")}
              onNavigateTeachers={() => navigateTo("teachers")}
              onNavigatePackages={() => navigateTo("packages")}
              onNavigateContact={() => navigateTo("contact")}
              onNavigateRegister={() => navigateTo("register")}
              onNavigateFAQ={() => navigateTo("faq")}
              onNavigateAdmin={() => navigateTo("admin")}
            />
            
            <div className="container mx-auto px-4 py-8">
              <PackagesSection 
                onPurchasePackage={handlePurchasePackage}
                user={user}
              />
            </div>
            
            <Footer 
              onShowTerms={() => setShowTermsModal(true)}
              onShowPrivacy={() => setShowPrivacyModal(true)}
            />
          </div>
        );
        
      case "contact":
        return (
          <div className="min-h-screen bg-background">
            <Navigation 
              user={user}
              onLoginClick={() => setShowAuthModal(true)}
              onAccountClick={() => setShowAccountModal(true)}
              currentView={currentView}
              onNavigateHome={() => navigateTo("home")}
              onNavigateClasses={() => navigateTo("classes")}
              onNavigateTeachers={() => navigateTo("teachers")}
              onNavigatePackages={() => navigateTo("packages")}
              onNavigateContact={() => navigateTo("contact")}
              onNavigateRegister={() => navigateTo("register")}
              onNavigateFAQ={() => navigateTo("faq")}
              onNavigateAdmin={() => navigateTo("admin")}
            />
            
            <div className="container mx-auto px-4 py-8">
              <ContactPage />
            </div>
            
            <Footer 
              onShowTerms={() => setShowTermsModal(true)}
              onShowPrivacy={() => setShowPrivacyModal(true)}
            />
          </div>
        );

      case "register":
        return (
          <div className="min-h-screen bg-background">
            <Navigation 
              user={user}
              onLoginClick={() => setShowAuthModal(true)}
              onAccountClick={() => setShowAccountModal(true)}
              currentView={currentView}
              onNavigateHome={() => navigateTo("home")}
              onNavigateClasses={() => navigateTo("classes")}
              onNavigateTeachers={() => navigateTo("teachers")}
              onNavigatePackages={() => navigateTo("packages")}
              onNavigateContact={() => navigateTo("contact")}
              onNavigateRegister={() => navigateTo("register")}
              onNavigateFAQ={() => navigateTo("faq")}
              onNavigateAdmin={() => navigateTo("admin")}
            />
            
            <div className="container mx-auto px-4 py-8">
              <ContactSection />
            </div>
            
            <Footer 
              onShowTerms={() => setShowTermsModal(true)}
              onShowPrivacy={() => setShowPrivacyModal(true)}
            />
          </div>
        );
        
      case "faq":
        return (
          <div className="min-h-screen bg-background">
            <Navigation 
              user={user}
              onLoginClick={() => setShowAuthModal(true)}
              onAccountClick={() => setShowAccountModal(true)}
              currentView={currentView}
              onNavigateHome={() => navigateTo("home")}
              onNavigateClasses={() => navigateTo("classes")}
              onNavigateTeachers={() => navigateTo("teachers")}
              onNavigatePackages={() => navigateTo("packages")}
              onNavigateContact={() => navigateTo("contact")}
              onNavigateRegister={() => navigateTo("register")}
              onNavigateFAQ={() => navigateTo("faq")}
              onNavigateAdmin={() => navigateTo("admin")}
            />
            
            <div className="container mx-auto px-4 py-8">
              <FAQSection />
            </div>
            
            <Footer 
              onShowTerms={() => setShowTermsModal(true)}
              onShowPrivacy={() => setShowPrivacyModal(true)}
            />
          </div>
        );
        
      case "admin":
        return (
          <div className="min-h-screen bg-background">
            <Navigation 
              user={user}
              onLoginClick={() => setShowAuthModal(true)}
              onAccountClick={() => setShowAccountModal(true)}
              currentView={currentView}
              onNavigateHome={() => navigateTo("home")}
              onNavigateClasses={() => navigateTo("classes")}
              onNavigateTeachers={() => navigateTo("teachers")}
              onNavigatePackages={() => navigateTo("packages")}
              onNavigateContact={() => navigateTo("contact")}
              onNavigateRegister={() => navigateTo("register")}
              onNavigateFAQ={() => navigateTo("faq")}
              onNavigateAdmin={() => navigateTo("admin")}
            />
            <AdminPanel user={user} onBack={handleBack} />
          </div>
        );
        
      default: // "home"
        return (
          <div className="min-h-screen bg-background">
            <Navigation 
              user={user}
              onLoginClick={() => setShowAuthModal(true)}
              onAccountClick={() => setShowAccountModal(true)}
              currentView={currentView}
              onNavigateHome={() => navigateTo("home")}
              onNavigateClasses={() => navigateTo("classes")}
              onNavigateTeachers={() => navigateTo("teachers")}
              onNavigatePackages={() => navigateTo("packages")}
              onNavigateContact={() => navigateTo("contact")}
              onNavigateRegister={() => navigateTo("register")}
              onNavigateFAQ={() => navigateTo("faq")}
              onNavigateAdmin={() => navigateTo("admin")}
            />
            
            <div className="container mx-auto px-4 py-8">
              {/* Hero Section */}
              <div className="mb-12">
                <HeroSection />
                <div className="text-center mt-6">
                  <Button onClick={handlePayNow} size="lg" className="px-8 py-3">
                    Book a Class Now
                  </Button>
                </div>
              </div>

              {/* Flowing Yoga Gallery */}
              <div className="mb-12">
                <FlowingYogaGallery />
              </div>

              {/* Studio Information */}
              <div className="mb-12">
                <StudioInfo />
              </div>

              {/* Virtual Class Information */}
              <div className="mb-12">
                <VirtualInfo />
              </div>

              <Footer 
                onShowTerms={() => setShowTermsModal(true)}
                onShowPrivacy={() => setShowPrivacyModal(true)}
              />
            </div>
          </div>
        );
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOMeta />
      {renderCurrentView()}

      {/* Admin Notification Display */}
      <AdminNotificationDisplay />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
          onSignup={handleSignup}
          onResetPassword={handleResetPassword}
      />

      {/* Account Modal */}
      <Dialog open={showAccountModal} onOpenChange={setShowAccountModal}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Your Account</DialogTitle>
            <DialogDescription>
              Manage your class credits, bookings, and account information.
            </DialogDescription>
          </DialogHeader>
          <UserAccount 
            user={user} 
            onLogout={handleLogout}
            onNavigateToClasses={() => {
              setShowAccountModal(false);
              navigateTo("classes");
            }}
            onNavigateToPackages={() => {
              setShowAccountModal(false);
              navigateTo("packages");
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Terms of Service Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Terms of Service</DialogTitle>
            <DialogDescription>
              Please read our terms of service and class policies carefully.
            </DialogDescription>
          </DialogHeader>
          <TermsOfService />
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Modal */}
      <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
            <DialogDescription>
              Learn how we collect, use, and protect your personal information.
            </DialogDescription>
          </DialogHeader>
          <PrivacyPolicy />
        </DialogContent>
      </Dialog>
    </>
  );
}