import { useState, useEffect } from 'react';
import { NirvaLogo } from './nirva-logo';
import { Button } from './ui/button';
import { User, Settings, Menu, X } from 'lucide-react';

interface NavigationProps {
  user: { email: string; name?: string } | null;
  onLoginClick: () => void;
  onAccountClick: () => void;
  currentView?: string;
  onNavigateHome?: () => void;
  onNavigateClasses?: () => void;
  onNavigateTeachers?: () => void;
  onNavigatePackages?: () => void;
  onNavigateContact?: () => void;
  onNavigateRegister?: () => void;
  onNavigateFAQ?: () => void;
  onNavigateAdmin?: () => void;
}

export function Navigation({ 
  user, 
  onLoginClick, 
  onAccountClick, 
  currentView,
  onNavigateHome,
  onNavigateClasses,
  onNavigateTeachers,
  onNavigatePackages,
  onNavigateContact,
  onNavigateRegister,
  onNavigateFAQ,
  onNavigateAdmin
}: NavigationProps) {
  const [showAdmin, setShowAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if user is authorized for admin access
  const isAdminAuthorized = user?.email === 'nirvayogastudio@gmail.com';

  // Listen for admin access key combination (Ctrl+Shift+A) - only for authorized users
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'A' && isAdminAuthorized) {
        event.preventDefault();
        setShowAdmin(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminAuthorized]);

  // Show admin button for authorized users
  useEffect(() => {
    if (isAdminAuthorized) {
      setShowAdmin(true);
    } else {
      setShowAdmin(false);
    }
  }, [isAdminAuthorized]);

  const handleMobileNavigate = (navigateFunc?: () => void) => {
    navigateFunc?.();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button onClick={onNavigateHome} className="flex items-center hover:opacity-80 transition-opacity">
            <NirvaLogo size="sm" />
          </button>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 font-body" style={{ fontSize: 'var(--font-size-base)' }}>
            <button 
              onClick={onNavigateHome}
              className={`transition-all duration-200 py-2 px-3 rounded-md ${
                currentView === "home" 
                  ? "text-primary font-semibold bg-accent" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              Home
            </button>
            <button 
              onClick={onNavigateClasses}
              className={`transition-all duration-200 py-2 px-3 rounded-md ${
                currentView === "classes" 
                  ? "text-primary font-semibold bg-accent" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              Classes
            </button>
            <button 
              onClick={onNavigatePackages}
              className={`transition-all duration-200 py-2 px-3 rounded-md ${
                currentView === "packages" 
                  ? "text-primary font-semibold bg-accent" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              Packages
            </button>
            <button 
              onClick={onNavigateTeachers}
              className={`transition-all duration-200 py-2 px-3 rounded-md ${
                currentView === "teachers" 
                  ? "text-primary font-semibold bg-accent" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              Teachers  
            </button>
            <button 
              onClick={onNavigateContact}
              className={`transition-all duration-200 py-2 px-3 rounded-md ${
                currentView === "contact" 
                  ? "text-primary font-semibold bg-accent" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              Contact  
            </button>
            <button 
              onClick={onNavigateRegister}
              className={`transition-all duration-200 py-2 px-3 rounded-md ${
                currentView === "register" 
                  ? "text-primary font-semibold bg-accent" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              Register  
            </button>
            <button 
              onClick={onNavigateFAQ}
              className={`transition-all duration-200 py-2 px-3 rounded-md ${
                currentView === "faq" 
                  ? "text-primary font-semibold bg-accent" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              FAQ  
            </button>
            
            {showAdmin && (
              <button 
                onClick={onNavigateAdmin}
                className={`transition-all duration-200 py-2 px-3 rounded-md flex items-center gap-1 ${
                  currentView === "admin" 
                    ? "text-primary font-semibold bg-accent" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                title="Admin Panel (Ctrl+Shift+A)"
              >
                <Settings className="w-3 h-3" />
                Admin  
              </button>
            )}
          </div>
          
          {/* Right side - Price and Auth */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Price - Hidden on very small screens */}
            <div className="hidden sm:flex bg-secondary px-3 py-2 rounded-full border border-border font-body text-sm">
              <span className="text-muted-foreground">Classes from</span>
              <span className="ml-1 font-semibold text-primary">$11</span>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
            
            {/* Desktop Auth Button */}
            <div className="hidden lg:block">
              {user ? (
                <Button
                  variant="outline"
                  size="default"
                  onClick={onAccountClick}
                  className="flex items-center gap-2 font-medium border-primary/20 hover:bg-accent"
                >
                  <User className="w-4 h-4" />
                  Account
                </Button>
              ) : (
                <Button
                  size="default"
                  onClick={onLoginClick}
                  className="flex items-center gap-2 font-medium bg-primary hover:bg-primary/90"
                >
                  <User className="w-4 h-4" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background border-b border-border shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => handleMobileNavigate(onNavigateHome)}
                className={`text-left py-3 px-4 rounded-lg transition-colors ${ 
                  currentView === "home" 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => handleMobileNavigate(onNavigateClasses)}
                className={`text-left py-3 px-4 rounded-lg transition-colors ${ 
                  currentView === "classes" 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Classes
              </button>
              <button 
                onClick={() => handleMobileNavigate(onNavigatePackages)}
                className={`text-left py-3 px-4 rounded-lg transition-colors ${ 
                  currentView === "packages" 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Packages
              </button>
              <button 
                onClick={() => handleMobileNavigate(onNavigateTeachers)}
                className={`text-left py-3 px-4 rounded-lg transition-colors ${ 
                  currentView === "teachers" 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Teachers
              </button>
              <button 
                onClick={() => handleMobileNavigate(onNavigateContact)}
                className={`text-left py-3 px-4 rounded-lg transition-colors ${ 
                  currentView === "contact" 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Contact
              </button>
              <button 
                onClick={() => handleMobileNavigate(onNavigateRegister)}
                className={`text-left py-3 px-4 rounded-lg transition-colors ${ 
                  currentView === "register" 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Register
              </button>
              <button 
                onClick={() => handleMobileNavigate(onNavigateFAQ)}
                className={`text-left py-3 px-4 rounded-lg transition-colors ${ 
                  currentView === "faq" 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                FAQ
              </button>
              
              {showAdmin && (
                <button 
                  onClick={() => handleMobileNavigate(onNavigateAdmin)}
                  className={`text-left py-3 px-4 rounded-lg transition-colors flex items-center gap-2 ${ 
                    currentView === "admin" 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Admin Panel
                </button>
              )}
              
              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground text-center mb-4">
                  Classes from <span className="font-medium text-primary">$11</span>
                </div>
                
                {/* Mobile Auth Button */}
                {user ? (
                  <Button
                    variant="outline"
                    size="default"
                    onClick={() => {
                      onAccountClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 font-medium border-primary/20 hover:bg-accent"
                  >
                    <User className="w-4 h-4" />
                    Account
                  </Button>
                ) : (
                  <Button
                    size="default"
                    onClick={() => {
                      onLoginClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 font-medium bg-primary hover:bg-primary/90"
                  >
                    <User className="w-4 h-4" />
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}