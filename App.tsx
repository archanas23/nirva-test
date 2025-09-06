import { useState } from "react";
import { Navigation } from "./components/navigation";
import { HeroSection } from "./components/hero-section";
import { ClassSchedule } from "./components/class-schedule";
import { StudioInfo } from "./components/studio-info";
import { TeachersSection } from "./components/teachers-section";
import { VirtualInfo } from "./components/virtual-info";
import { ContactSection } from "./components/contact-section";
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
    fivePack: number;
    tenPack: number;
  };
}

export default function App() {
  const [currentView, setCurrentView] = useState<"home" | "classes" | "teachers" | "packages" | "contact" | "faq" | "payment" | "admin">("home");
  const [selectedClass, setSelectedClass] = useState<{
    className: string;
    teacher: string;
    time: string;
    day: string;
    classId?: string;
  } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleLogin = (email: string) => {
    // Mock user data - in real app this would come from backend
    setUser({
      email,
      name: email.split('@')[0],
      classPacks: {
        fivePack: 0, // Fresh start - users begin with no class packs
        tenPack: 0
      }
    });
  };

  const handleLogout = () => {
    setUser(null);
    setShowAccountModal(false);
  };

  const handlePackagePurchase = (packageType: 'single' | 'five' | 'ten') => {
    if (!user) return;
    
    setUser(prev => {
      if (!prev) return prev;
      const newClassPacks = { ...prev.classPacks };
      
      if (packageType === 'five') {
        newClassPacks.fivePack += 5;
      } else if (packageType === 'ten') {
        newClassPacks.tenPack += 10;
      }
      // Single classes are used immediately, no need to add to pack
      
      return { ...prev, classPacks: newClassPacks };
    });
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

  const handleBookClass = (classItem: ClassItem, day: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    setSelectedClass({
      className: classItem.className,
      teacher: classItem.teacher,
      time: classItem.time,
      day: day,
      classId: classItem.id // Add unique class ID for Zoom link generation
    });
    setCurrentView("payment");
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setSelectedClass(null);
  };

  const handleNavigateToClasses = () => {
    setCurrentView("classes");
  };

  const handleNavigateToTeachers = () => {
    setCurrentView("teachers");
  };

  const handleNavigateToPackages = () => {
    setCurrentView("packages");
  };

  const handleNavigateToContact = () => {
    setCurrentView("contact");
  };

  const handleNavigateToFAQ = () => {
    setCurrentView("faq");
  };

  const handleNavigateToAdmin = () => {
    setCurrentView("admin");
  };

  const handlePayNow = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedClass(null);
    setCurrentView("payment");
  };

  const handlePurchasePackage = (packageType: 'single' | 'five' | 'ten') => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    // For package purchases, we go to payment with no selected class
    setSelectedClass(null);
    setCurrentView("payment");
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "payment":
        return (
          <PaymentPage 
            onBack={handleBackToHome} 
            selectedClass={selectedClass}
            user={user}
            onPackagePurchase={handlePackagePurchase}
            onUseClassPack={handleUseClassPack}
          />
        );
      
      case "classes":
        return (
          <div className="min-h-screen bg-background">
            <Navigation 
              user={user}
              onLoginClick={() => setShowAuthModal(true)}
              onAccountClick={() => setShowAccountModal(true)}
              currentView={currentView}
              onNavigateHome={() => setCurrentView("home")}
              onNavigateClasses={() => setCurrentView("classes")}
              onNavigateTeachers={() => setCurrentView("teachers")}
              onNavigatePackages={() => setCurrentView("packages")}
              onNavigateContact={() => setCurrentView("contact")}
              onNavigateFAQ={() => setCurrentView("faq")}
              onNavigateAdmin={() => setCurrentView("admin")}
            />
            
            <div className="container mx-auto px-4 py-8">
              <ClassSchedule onBookClass={handleBookClass} />
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
              onNavigateHome={() => setCurrentView("home")}
              onNavigateClasses={() => setCurrentView("classes")}
              onNavigateTeachers={() => setCurrentView("teachers")}
              onNavigatePackages={() => setCurrentView("packages")}
              onNavigateContact={() => setCurrentView("contact")}
              onNavigateFAQ={() => setCurrentView("faq")}
              onNavigateAdmin={() => setCurrentView("admin")}
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
              onNavigateHome={() => setCurrentView("home")}
              onNavigateClasses={() => setCurrentView("classes")}
              onNavigateTeachers={() => setCurrentView("teachers")}
              onNavigatePackages={() => setCurrentView("packages")}
              onNavigateContact={() => setCurrentView("contact")}
              onNavigateFAQ={() => setCurrentView("faq")}
              onNavigateAdmin={() => setCurrentView("admin")}
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
              onNavigateHome={() => setCurrentView("home")}
              onNavigateClasses={() => setCurrentView("classes")}
              onNavigateTeachers={() => setCurrentView("teachers")}
              onNavigatePackages={() => setCurrentView("packages")}
              onNavigateContact={() => setCurrentView("contact")}
              onNavigateFAQ={() => setCurrentView("faq")}
              onNavigateAdmin={() => setCurrentView("admin")}
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
              onNavigateHome={() => setCurrentView("home")}
              onNavigateClasses={() => setCurrentView("classes")}
              onNavigateTeachers={() => setCurrentView("teachers")}
              onNavigatePackages={() => setCurrentView("packages")}
              onNavigateContact={() => setCurrentView("contact")}
              onNavigateFAQ={() => setCurrentView("faq")}
              onNavigateAdmin={() => setCurrentView("admin")}
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
        return <AdminPanel />;
        
      default: // "home"
        return (
          <div className="min-h-screen bg-background">
            <Navigation 
              user={user}
              onLoginClick={() => setShowAuthModal(true)}
              onAccountClick={() => setShowAccountModal(true)}
              currentView={currentView}
              onNavigateHome={() => setCurrentView("home")}
              onNavigateClasses={() => setCurrentView("classes")}
              onNavigateTeachers={() => setCurrentView("teachers")}
              onNavigatePackages={() => setCurrentView("packages")}
              onNavigateContact={() => setCurrentView("contact")}
              onNavigateFAQ={() => setCurrentView("faq")}
              onNavigateAdmin={() => setCurrentView("admin")}
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
      />

      {/* Account Modal */}
      <Dialog open={showAccountModal} onOpenChange={setShowAccountModal}>
        <DialogContent className="sm:max-w-5xl">
          <UserAccount user={user} onLogout={handleLogout} />
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