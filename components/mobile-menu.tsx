import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

interface MobileMenuProps {
  currentView?: string;
  onNavigateHome?: () => void;
  onNavigateClasses?: () => void;
  onNavigateTeachers?: () => void;
  onNavigatePackages?: () => void;
  onNavigateContact?: () => void;
}

export function MobileMenu({ 
  currentView,
  onNavigateHome,
  onNavigateClasses,
  onNavigateTeachers,
  onNavigatePackages,
  onNavigateContact
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (navigateFunc?: () => void) => {
    navigateFunc?.();
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64">
          <div className="flex flex-col gap-4 mt-8">
            <button 
              onClick={() => handleNavigate(onNavigateHome)}
              className={`text-left py-3 px-4 rounded-lg transition-colors ${ 
                currentView === "home" 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavigate(onNavigateClasses)}
              className={`text-left py-3 px-4 rounded-lg transition-colors ${ 
                currentView === "classes" 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Classes
            </button>
            <button 
              onClick={() => handleNavigate(onNavigatePackages)}
              className={`text-left py-3 px-4 rounded-lg transition-colors ${ 
                currentView === "packages" 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Packages
            </button>
            <button 
              onClick={() => handleNavigate(onNavigateTeachers)}
              className={`text-left py-3 px-4 rounded-lg transition-colors ${ 
                currentView === "teachers" 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Teachers
            </button>
            <button 
              onClick={() => handleNavigate(onNavigateContact)}
              className={`text-left py-3 px-4 rounded-lg transition-colors ${ 
                currentView === "contact" 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Contact
            </button>
            
            <div className="mt-6 pt-6 border-t border-border">
              <div className="text-sm text-muted-foreground text-center">
                Classes from <span className="font-medium text-primary">$10</span>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}