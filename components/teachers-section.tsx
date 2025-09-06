import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from './figma/ImageWithFallback';
import archanaImage from './src/assets/teacher2.png';
import harshadaImage from './src/assets/teacher1.png';

const teachers = [
  {
    id: "1",
    name: "Harshada Madiraju",
    specialties: ["Vinyasa Flow", "Power Yoga", "Alignment-Based Practice", "Gentle Yoga"],
    bio: "Harshada brings 10 years of experience and a gentle, nurturing approach to yoga. She provides special attention to each student, ensuring proper alignment and modifications using props like blocks, straps, and bolsters to support all levels. Her virtual classes guarantee progress in both flexibility and mental clarity through personalized guidance that honors each individual's unique needs and abilities.",
    image: harshadaImage,
    certifications: ["200-Hour Yoga Teacher Certified", "Vinyasa Flow Specialist", "Power Yoga Certified"],
    experience: "10 years"
  },
  {
    id: "2", 
    name: "Archana Soundararajan",
    specialties: ["Vinyasa Flow", "Power Yoga", "Strength Building", "Dynamic Flow"],
    bio: "Archana combines strength and dynamic teaching style to create transformative yoga experiences. She provides individualized attention to help each student progress safely while building physical strength. Her classes guarantee measurable improvements in strength, balance, and mental focus through her energetic and supportive approach.",
    image: archanaImage,
    certifications: ["200-Hour Yoga Teacher Certified", "Vinyasa Flow Specialist", "Power Yoga Certified"],
    experience: "8 years"
  }
];

export function TeachersSection() {
  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h2 className="mb-4">Meet Our Teachers</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our experienced instructors bring passion, expertise, and personalized attention to every virtual class. 
          Each teacher is certified and dedicated to helping you deepen your practice from the comfort of your home.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {teachers.map((teacher) => (
          <Card key={teacher.id} className="overflow-hidden">
            <div className="aspect-square overflow-hidden">
              <ImageWithFallback
                src={teacher.image}
                alt={`${teacher.name} - Yoga Teacher`}
                className={`w-full h-full object-cover transition-transform hover:scale-105 ${
                  teacher.name === "Archana Soundararajan" ? "object-bottom" : ""
                }`}
              />
            </div>
            <CardContent className="p-6">
              <h3 className="mb-2">{teacher.name}</h3>
              
              <div className="mb-3">
                <div className="flex flex-wrap gap-2 mb-3">
                  {teacher.specialties.slice(0, 2).map((specialty, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                  {teacher.specialties.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{teacher.specialties.length - 2} more
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                {teacher.bio}
              </p>
              
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  <strong>Experience:</strong> {teacher.experience}
                </div>
                <div className="text-xs text-muted-foreground">
                  <strong>Certifications:</strong> {teacher.certifications.join(", ")}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}