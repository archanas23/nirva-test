import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Mail, Phone, MapPin, Clock, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { EmailService } from '../utils/email-service';

export function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
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
      // Send contact inquiry email
      await EmailService.sendEmail({
        type: 'contact-inquiry',
        data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        }
      });
      
      toast.success('Thank you for your message! We\'ll get back to you soon.');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Contact submission error:', error);
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
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-green-600 mb-2">Message Sent!</h3>
                <p className="text-muted-foreground mb-4">
                  Thank you, {formData.firstName}! We'll get back to you soon.
                </p>
                <div className="bg-accent/30 p-4 rounded-lg text-sm">
                  <p className="font-medium mb-2">What happens next:</p>
                  <ul className="text-left space-y-1 text-muted-foreground">
                    <li>• We'll review your message within 24 hours</li>
                    <li>• You'll receive a response at {formData.email}</li>
                    <li>• For urgent questions, call us at (805) 807-4894</li>
                  </ul>
                </div>
                <Button 
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      firstName: '',
                      lastName: '',
                      email: '',
                      subject: '',
                      message: ''
                    });
                  }}
                  variant="outline" 
                  className="mt-4"
                >
                  Send Another Message
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
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
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
                  <p className="font-medium">Payment Methods</p>
                  <p className="text-muted-foreground">Secure payments via Stripe</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All major credit cards, debit cards, and digital wallets accepted
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
