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
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      
      // Show success message and mark as submitted
      toast.success('Registration submitted successfully! We\'ll send you class information soon.');
      setIsSubmitted(true);
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
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-green-600 mb-2">Registration Submitted!</h3>
                <p className="text-muted-foreground mb-4">
                  Thank you, {formData.firstName}! We'll send you class information soon.
                </p>
                <div className="bg-accent/30 p-4 rounded-lg text-sm">
                  <p className="font-medium mb-2">What happens next:</p>
                  <ul className="text-left space-y-1 text-muted-foreground">
                    <li>• You'll receive an email with class schedules</li>
                    <li>• We'll send you booking instructions</li>
                    <li>• You can start booking classes right away!</li>
                  </ul>
                </div>
                <Button 
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      firstName: '',
                      lastName: '',
                      email: '',
                      interestLevel: '',
                      yogaGoals: ''
                    });
                  }}
                  variant="outline" 
                  className="mt-4"
                >
                  Register Another Person
                </Button>
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>

        {/* Class Information */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Class Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-accent/30 rounded-lg">
                  <span className="font-medium">Single Class</span>
                  <span className="text-2xl font-bold text-primary">$11</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-accent/30 rounded-lg">
                  <span className="font-medium">5-Class Package</span>
                  <span className="text-2xl font-bold text-primary">$53</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-accent/30 rounded-lg">
                  <span className="font-medium">10-Class Package</span>
                  <span className="text-2xl font-bold text-primary">$105</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-accent/30 rounded-lg border-2 border-primary/20">
                  <div>
                    <span className="font-medium">Private Sessions</span>
                    <p className="text-sm text-muted-foreground">60 minutes</p>
                  </div>
                  <span className="text-2xl font-bold text-primary">$60</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Live virtual classes via Zoom
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Interactive instruction from certified teachers
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  All levels welcome with modifications
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Classes never expire
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Maximum 10 students per class
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Recording available upon request
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h4 className="mb-3 text-primary">Next Steps After Registration</h4>
              <div className="space-y-2 text-sm">
                <p>1. <strong>Email Confirmation</strong> - You'll receive class schedules and booking instructions</p>
                <p>2. <strong>Welcome Package</strong> - Everything you need to get started</p>
                <p>3. <strong>Book Your First Class</strong> - Choose from our weekly schedule</p>
                <p>4. <strong>Join via Zoom</strong> - Receive meeting links 24 hours before class</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}