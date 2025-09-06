import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Mail, CheckCircle } from "lucide-react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      // In a real app, this would connect to your email service
      console.log('Newsletter signup:', email);
      setIsSubmitted(true);
      setEmail("");
      
      // Reset after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary/5 to-accent/10 py-12 rounded-lg">
      <div className="text-center max-w-2xl mx-auto px-6">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Mail className="w-6 h-6 text-primary" />
          </div>
        </div>
        
        <h3 className="mb-3 text-gray-800">Stay Connected with Nirva Yoga</h3>
        <p className="text-gray-600 mb-6">
          Receive weekly yoga tips, mindfulness practices, and be the first to know about special class offerings and wellness workshops.
        </p>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              required
            />
            <Button type="submit" className="sm:w-auto">
              Subscribe
            </Button>
          </form>
        ) : (
          <div className="flex items-center justify-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span>Thank you! You're now subscribed to our newsletter.</span>
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
}