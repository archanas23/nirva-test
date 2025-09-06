import { ImageWithFallback } from './figma/ImageWithFallback';

export function YogaPosesSection() {
  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h2 className="mb-4 text-gray-800">Experience the Journey</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          From grounding poses that connect you to your foundation, to inversions that shift your perspective - 
          every practice is a step towards inner peace and physical strength.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Inversion Pose */}
        <div className="relative group">
          <div className="aspect-[4/5] rounded-lg overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1602925868187-0e42738754a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwaW52ZXJzaW9uJTIwaGVhZHN0YW5kJTIwcG9zZXxlbnwxfHx8fDE3NTcwNDIxNzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Student practicing yoga inversion pose"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-gray-800 mb-2">Build Strength & Confidence</h3>
            <p className="text-gray-600 text-sm">
              Inversions challenge your perspective and build both physical strength and mental resilience
            </p>
          </div>
        </div>

        {/* Child's Pose */}
        <div className="relative group">
          <div className="aspect-[4/5] rounded-lg overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1630571050152-49d673ccfe13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwY2hpbGQlMjBwb3NlJTIwbWVkaXRhdGlvbnxlbnwxfHx8fDE3NTcwNDIxNzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Student practicing child's pose for deep relaxation"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-gray-800 mb-2">Find Inner Peace</h3>
            <p className="text-gray-600 text-sm">
              Restorative poses like child's pose help you reconnect with your breath and find calm
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-700 font-medium">
          Join our community of dedicated practitioners and experience transformation from the comfort of your home
        </p>
      </div>
    </div>
  );
}