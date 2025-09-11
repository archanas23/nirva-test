import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password?: string) => void;
  onSignup: (email: string, password: string, name: string) => void;
  onResetPassword: (email: string) => void;
}

export function AuthModal({ isOpen, onClose, onLogin, onSignup, onResetPassword }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const tabsRef = useRef<HTMLDivElement>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      setMessage("");
      try {
        await onLogin(email, password);
        onClose();
      } catch (error) {
        setMessage("Login failed. Please check your credentials.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && name) {
      setIsLoading(true);
      setMessage("");
      try {
        await onSignup(email, password, name);
        setMessage("Account created! Please check your email to confirm your account.");
      } catch (error: any) {
        setMessage(error.message || "Signup failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsLoading(true);
      setMessage("");
      try {
        await onResetPassword(email);
        setMessage("Password reset email sent! Check your inbox.");
      } catch (error: any) {
        setMessage(error.message || "Failed to send reset email. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Nirva Yoga</DialogTitle>
          <DialogDescription>
            Sign in to your account, create a new account, or reset your password.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="reset">Reset Password</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="reset">
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Email"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        {message && (
          <div className={`text-center text-sm mt-4 p-4 rounded-lg ${
            message.includes("success") || message.includes("sent") || message.includes("created")
              ? "bg-green-50 text-green-700 border border-green-200"
              : message.includes("already exists")
              ? "bg-amber-50 text-amber-800 border border-amber-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message}
            {message.includes("already exists") && (
              <div className="mt-2">
                <p className="text-amber-700 text-sm">
                  💡 <strong>Tip:</strong> Use the "Reset Password" tab above to reset your password
                </p>
              </div>
            )}
          </div>
        )}
        
        <div className="text-center text-sm text-muted-foreground mt-4">
          <p>🔒 Secure login required for all purchases</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}