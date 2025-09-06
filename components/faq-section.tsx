import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

export function FAQSection() {
  const faqs = [
    {
      question: "What equipment do I need for virtual yoga classes?",
      answer: "All you need is a yoga mat, comfortable clothing, and a stable internet connection. We recommend having a water bottle nearby and enough space to extend your arms and legs freely. Props like blocks or straps are optional but can enhance your practice."
    },
    {
      question: "How do I join a Zoom class?",
      answer: "After booking a class, you'll receive a Zoom link via email 24 hours before class time. Simply click the link at the scheduled time to join. We recommend logging in 5 minutes early to test your audio and video settings."
    },
    {
      question: "What is your cancellation and refund policy?",
      answer: "All classes must be paid in full at booking with no cancellations, refunds, or transfers for any reason. This strict policy allows us to maintain our affordable $10/class pricing and ensures spots are reserved for committed students. Classes in your pack never expire, so you can use them for future bookings."
    },
    {
      question: "Are classes suitable for beginners?",
      answer: "Absolutely! Both our teachers provide modifications for all levels. We believe in meeting students where they are and supporting your unique journey. Let us know if it's your first class and we'll give you extra guidance."
    },
    {
      question: "What's the maximum class size?",
      answer: "We limit all classes to 10 students maximum to ensure personalized attention and proper guidance from our certified instructors. This intimate setting allows for individual adjustments and a more connected experience."
    },
    {
      question: "Do you offer private sessions?",
      answer: "Yes! We offer one-on-one virtual sessions for personalized instruction. Private sessions are $75 for 60 minutes. Contact us directly to schedule your private session with either Harshada or Archana."
    },
    {
      question: "What if I have injuries or physical limitations?",
      answer: "Please inform us of any injuries or limitations when you book. Our certified instructors can provide modifications and alternative poses to ensure a safe practice. Your wellbeing is our top priority."
    },
    {
      question: "Are classes recorded?",
      answer: "Classes are recorded with student consent for instructional purposes. Recordings are available upon request to students who attended the live class. We prioritize your privacy and only share recordings with participants who were present during the session."
    },
    {
      question: "How do I pay for classes?",
      answer: "We use Zelle for all payments - it's instant, secure, and has no fees! When you book a class, you'll be guided through sending payment via Zelle to our phone number. Most major banks support Zelle through their mobile apps. We verify payments quickly and you'll receive confirmation within minutes."
    },
    {
      question: "Why Zelle instead of credit cards?",
      answer: "Zelle allows us to keep costs low since there are no processing fees (unlike credit cards that charge 2.9% + fees). This savings gets passed directly to you with our affordable $10 class pricing! Plus, Zelle is instant and secure since it's built into your banking app."
    },
    {
      question: "What if my bank doesn't support Zelle?",
      answer: "Most major banks support Zelle, including Chase, Bank of America, Wells Fargo, and hundreds of others. If your bank doesn't support Zelle, please contact us directly and we can arrange alternative payment methods on a case-by-case basis."
    }
  ];

  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h2 className="mb-4 text-gray-800">Frequently Asked Questions</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Everything you need to know about joining our virtual yoga community
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}