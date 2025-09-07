import { useState, useEffect } from 'react';
import { NirvaLogo } from './nirva-logo';
import { Button } from './ui/button';
import { User, Settings } from 'lucide-react';

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
  onNavigateFAQ,
  onNavigateAdmin
}: NavigationProps) {
  const [showAdmin, setShowAdmin] = useState(true); // Always show admin for testing

  // Listen for admin access key combination (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        setShowAdmin(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button onClick={onNavigateHome} className="flex items-center hover:opacity-80 transition-opacity">
            <NirvaLogo size="sm" />
          </button>
          
          <div className="hidden md:flex items-center gap-6 lg:gap-8 font-body" style={{ fontSize: 'var(--font-size-base)' }}>
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
          
          <div className="flex items-center gap-6">
            <div className="bg-secondary px-4 py-2 rounded-full border border-border font-body" style={{ fontSize: 'var(--font-size-base)' }}>
              <span className="text-muted-foreground">Classes from</span>
              <span className="ml-1 font-semibold text-primary">$11</span>
            </div>
            
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
    </nav>
  );
}