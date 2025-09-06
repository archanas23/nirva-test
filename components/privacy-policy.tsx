import { ScrollArea } from "./ui/scroll-area";

export function PrivacyPolicy() {
  return (
    <ScrollArea className="h-[60vh]">
      <div className="p-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="mb-2">Nirva Yoga Privacy Policy</h1>
          <p className="text-muted-foreground">Effective Date: September 5th, 2025</p>
        </div>

        <div className="space-y-6">
          <div>
            <p className="mb-4">
              At Nirva Yoga, we believe that privacy is part of well-being. Just as we value creating a safe space 
              in our studio, we are committed to protecting the personal information you share with us. This Privacy 
              Policy explains how we handle your information when you visit our website, register for classes, attend 
              events, or communicate with us.
            </p>
          </div>

          <div>
            <h2 className="mb-3">1. Information We Collect</h2>
            <div className="space-y-2 text-sm">
              <p>To serve you better, we may collect:</p>
              <p>• Your name and contact information (such as email address or phone number)</p>
              <p>• Registration and payment details when you sign up for classes or workshops</p>
              <p>• Basic technical details like IP address, browser type, or device information when you use our website</p>
              <p>• Preferences you share with us, such as class interests or feedback</p>
            </div>
          </div>

          <div>
            <h2 className="mb-3">2. How We Use Your Information</h2>
            <div className="space-y-2 text-sm">
              <p>We use your information to:</p>
              <p>• Confirm class bookings and process payments</p>
              <p>• Share updates about schedules, workshops, and studio news</p>
              <p>• Respond to your questions or feedback</p>
              <p>• Improve our offerings and community experience</p>
              <p>• Meet any legal or regulatory requirements</p>
            </div>
          </div>

          <div>
            <h2 className="mb-3">3. How We Protect Your Information</h2>
            <div className="space-y-2 text-sm">
              <p>• Payment information is processed securely through trusted third-party providers</p>
              <p>• We use secure hosting services and firewalls to protect website data</p>
              <p>• Only authorized team members have access to personal information needed for studio operations</p>
              <p>• We never sell or rent your information to outside companies</p>
            </div>
          </div>

          <div>
            <h2 className="mb-3">4. Sharing Your Information</h2>
            <div className="space-y-2 text-sm">
              <p>Your information may only be shared with:</p>
              <p>• Service providers that help us operate (e.g., scheduling or email platforms)</p>
              <p>• Legal authorities if required by law</p>
              <p>• We do not share personal information for marketing by other organizations</p>
            </div>
          </div>

          <div>
            <h2 className="mb-3">5. Your Choices</h2>
            <div className="space-y-2 text-sm">
              <p>• You can unsubscribe from our emails at any time by clicking the link provided or contacting us directly</p>
              <p>• You can request to review, update, or delete your information by emailing us at nirvayogastudio@gmail.com</p>
            </div>
          </div>

          <div>
            <h2 className="mb-3">6. Cookies and Website Tools</h2>
            <div className="space-y-2 text-sm">
              <p>Our website may use cookies or analytics tools to understand how visitors interact with our pages. 
              This helps us improve your online experience. You can adjust your browser settings to limit or block 
              cookies if you prefer.</p>
            </div>
          </div>

          <div>
            <h2 className="mb-3">7. Updates to This Policy</h2>
            <div className="space-y-2 text-sm">
              <p>As our studio grows, we may update this Privacy Policy. Any changes will be posted here with a 
              new effective date.</p>
            </div>
          </div>

          <div>
            <h2 className="mb-3">8. Contact Us</h2>
            <div className="space-y-2 text-sm">
              <p>If you have questions or requests regarding your information, please reach out:</p>
              <p>📧 Email: nirvayogastudio@gmail.com</p>
            </div>
          </div>

          <div className="text-center pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground italic">
              ✨ Thank you for being part of the Nirva Yoga community. We honor your trust both on and off the mat.
            </p>
            <p className="text-sm text-muted-foreground mt-2">— The Nirva Yoga Team</p>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}