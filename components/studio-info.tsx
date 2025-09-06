import { ImageWithFallback } from './figma/ImageWithFallback';

export function StudioInfo() {
  return (
    <div className="max-w-4xl mx-auto">
      <div>
        <h2 className="mb-4">About Nirva Yoga</h2>
        <p className="mb-4">
          At Nirva Yoga, we believe in making yoga accessible to everyone, everywhere. 
          Our experienced instructors guide students of all levels through transformative 
          virtual practices, bringing the studio experience directly to your home.
        </p>
        <p className="mb-4">
          With live Zoom classes at just $10/class, we're committed to removing barriers 
          and helping our global community find balance, strength, and inner peace through yoga. 
          Join us from anywhere in the world for authentic, interactive yoga instruction.
        </p>
        <p className="mb-6 p-4 bg-accent rounded-lg border border-primary/20">
          <strong>Our Promise:</strong> We provide special attention to each student and guarantee 
          progress in both your physical practice and mental well-being. Every class is designed 
          to meet you where you are and help you grow stronger, more flexible, and more centered.
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>Your Home</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📞</span>
            <span>(805)807-4894</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✉️</span>
            <span>nirvayogastudio@gmail.com</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📱</span>
            <a 
              href="https://instagram.com/nirvayogastudio" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              @NirvaYogaStudio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}