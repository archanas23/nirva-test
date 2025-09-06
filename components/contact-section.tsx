import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

export function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock email sending - in production, this would integrate with EmailJS or backend API
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Create mailto link for fallback
      const mailtoLink = `mailto:nirvayogastudio@gmail.com?subject=${encodeURIComponent(formData.subject || 'Contact Form Submission')}&body=${encodeURIComponent(
        `Name: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;
      
      // Open mail client
      window.location.href = mailtoLink;
      
      toast.success('Thank you for your message! We\'ll get back to you soon.');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="mb-4">Get In Touch</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Have a question about our classes? Want to learn more about yoga? 
          We'd love to hear from you and help guide you on your yoga journey.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What's this about?"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us how we can help you..."
                  rows={5}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Submit'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Email</p>
                  <a 
                    href="mailto:nirvayogastudio@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    nirvayogastudio@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Phone & Zelle Payments</p>
                  <a 
                    href="tel:+18058074894"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    (805) 807-4894
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use this number for Zelle payments
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Virtual Class Hours</p>
                  <p className="text-muted-foreground">Monday - Sunday</p>
                  <p className="text-muted-foreground">6:30 AM - 8:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Practice Location</p>
                  <p className="text-muted-foreground">From the comfort of your home</p>
                  <p className="text-muted-foreground">via Zoom</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Follow Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Stay connected with us on social media for daily inspiration, 
                  pose tips, and community updates.
                </p>
                <a 
                  href="https://instagram.com/nirvayogastudio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  @NirvaYogaStudio
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent/30">
            <CardContent className="pt-6">
              <h4 className="mb-3">Response Time</h4>
              <p className="text-muted-foreground text-sm">
                We typically respond to all inquiries within 24 hours. 
                For urgent questions about upcoming classes, feel free to 
                reach out directly via Instagram DM.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}