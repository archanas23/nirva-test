import { ScrollArea } from "./ui/scroll-area";

export function TermsOfService() {
  return (
    <ScrollArea className="h-[60vh]">
      <div className="p-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="mb-2">Nirva Yoga Terms of Service</h1>
          <p className="text-muted-foreground">Effective Date: September 5, 2025</p>
        </div>

        <div className="space-y-6">
          <div>
            <p className="mb-4">
              Welcome to Nirva Yoga. By visiting our website, booking a class, or attending our studio, you agree to the following Terms of Service.
            </p>
          </div>

          <div>
            <h2 className="mb-3">1. Classes, Workshops, and Events</h2>
            <div className="space-y-2 text-sm">
              <p>Class schedules may change from time to time. We will do our best to notify you of updates.</p>
              <p>Registration may be required to secure your spot in a class, workshop, or event.</p>
            </div>
          </div>

          <div>
            <h2 className="mb-3">2. Payments</h2>
            <div className="space-y-2 text-sm">
              <p>All classes, memberships, and events must be paid in full at the time of booking.</p>
              <p>Payments are final. We do not offer cancellations, refunds, or transfers for any reason, including missed or unused classes.</p>
            </div>
          </div>

          <div>
            <h2 className="mb-3">3. Health and Safety</h2>
            <div className="space-y-2 text-sm">
              <p>By participating in our offerings, you confirm that you are in good health and able to engage in physical activity.</p>
              <p>Always listen to your body and practice at your own pace.</p>
              <p>Please inform the instructor of any injuries or health conditions before class.</p>
              <p>Nirva Yoga is not liable for injuries or health issues that may arise during practice. Participation is at your own risk.</p>
            </div>
          </div>

          <div>
            <h2 className="mb-3">4. Code of Conduct</h2>
            <div className="space-y-2 text-sm">
              <p>Please arrive on time and respect the peaceful atmosphere of our classes.</p>
              <p>Phones and devices should be silenced during sessions.</p>
              <p>We reserve the right to refuse service to anyone whose behavior is disruptive, unsafe, or disrespectful.</p>
            </div>
          </div>

          <div>
            <h2 className="mb-3">5. Website and Online Content</h2>
            <div className="space-y-2 text-sm">
              <p>All schedules, images, and written content on our website are the property of Nirva Yoga and may not be copied or used without permission.</p>
              <p>Our website and booking system are provided for personal, non-commercial use only.</p>
            </div>
          </div>

          <div>
            <h2 className="mb-3">6. Updates to Terms</h2>
            <div className="space-y-2 text-sm">
              <p>We may update these Terms of Service occasionally. Any changes will take effect when posted on our website.</p>
            </div>
          </div>

          <div>
            <h2 className="mb-3">7. Contact Us</h2>
            <div className="space-y-2 text-sm">
              <p>If you have any questions about these Terms, please contact us:</p>
              <p>📧 Email: nirvayogastudio@gmail.com</p>
            </div>
          </div>

          <div className="text-center pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground italic">
              🙏 Thank you for your understanding and for being part of the Nirva Yoga community.
            </p>
            <p className="text-sm text-muted-foreground mt-2">— The Nirva Yoga Team</p>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}