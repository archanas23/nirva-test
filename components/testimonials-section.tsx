import { Star } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      location: "San Francisco, CA",
      text: "Harshada's gentle approach helped me find peace during stressful times. The virtual format is perfect - I can practice from home while still feeling connected to a community.",
      rating: 5,
      classType: "Vinyasa Flow"
    },
    {
      name: "Michael Rodriguez", 
      location: "Austin, TX",
      text: "Archana's power yoga classes are exactly what I needed to build strength. Her dynamic style pushes me while keeping safety first. Best investment I've made for my health!",
      rating: 5,
      classType: "Power Yoga"
    },
    {
      name: "Emily Watson",
      location: "Denver, CO", 
      text: "I was skeptical about virtual yoga, but Nirva Yoga changed my mind completely. The teachers give personalized attention even through the screen. I've seen real progress in just 2 months!",
      rating: 5,
      classType: "Gentle Flow"
    },
    {
      name: "David Kim",
      location: "Seattle, WA",
      text: "As a complete beginner, I was nervous to start. Both teachers are incredibly patient and encouraging. The class packs are a great value and never expiring is perfect for my busy schedule.",
      rating: 5,
      classType: "Beginner Flow"
    }
  ];

  return (
    <div className="py-12 bg-gradient-to-r from-pink-25 via-cream-25 to-white/50">
      <div className="text-center mb-10">
        <h2 className="mb-4 text-gray-800">What Our Students Say</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Real experiences from our virtual yoga community
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="bg-white/80 backdrop-blur-sm border-primary/10 hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              {/* Stars */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              {/* Testimonial text */}
              <p className="text-gray-700 mb-4 italic leading-relaxed">
                "{testimonial.text}"
              </p>
              
              {/* Student info */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-primary font-medium">{testimonial.classType}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}