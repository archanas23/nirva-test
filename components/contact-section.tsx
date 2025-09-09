import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Mail, Phone, MapPin, Clock, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { EmailService } from '../utils/email-service';

export function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    interestLevel: '',
    yogaGoals: ''
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
      // Send registration inquiry email
      await EmailService.sendEmail({
        type: 'registration-inquiry',
        data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          interestLevel: formData.interestLevel,
          yogaGoals: formData.yogaGoals
        }
      });
      
      // Show success message and reset form without page refresh
      toast.success('Registration submitted successfully! We\'ll send you class information soon.');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        interestLevel: '',
        yogaGoals: ''
      });
    } catch (error) {
      console.error('Registration submission error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="mb-4">Register Here</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Ready to start your yoga journey? Register for our virtual classes and begin your practice with us today.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Register for Classes</CardTitle>
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
                  <Label htmlFor="interestLevel">Interest Level</Label>
                  <Input
                    id="interestLevel"
                    name="interestLevel"
                    value={formData.interestLevel}
                    onChange={handleInputChange}
                    placeholder="Beginner, Intermediate, or Advanced?"
                  />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="yogaGoals">Tell us about your yoga goals</Label>
                <Textarea
                  id="yogaGoals"
                  name="yogaGoals"
                  value={formData.yogaGoals}
                  onChange={handleInputChange}
                  placeholder="What brings you to yoga? Any specific goals or areas you'd like to focus on?"
                  rows={5}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register Now'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Class Information</CardTitle>
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
                  <p className="font-medium">Phone</p>
                  <a 
                    href="tel:+18058074894"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    (805) 807-4894
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Class Pricing</p>
                  <p className="text-muted-foreground">Single Class: $11</p>
                  <p className="text-muted-foreground">5-Class Package: $53</p>
                  <p className="text-muted-foreground">10-Class Package: $105</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Private Sessions: $60 (60 minutes)
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
              <h4 className="mb-3">Next Steps</h4>
              <p className="text-muted-foreground text-sm">
                After registering, you'll receive an email with class schedules, 
                booking instructions, and payment options. We'll also send you 
                a welcome package with everything you need to get started!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}