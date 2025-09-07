import { NirvaLogo } from './nirva-logo';

export function HeroSection() {
  return (
    <div className="relative min-h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] w-full overflow-hidden rounded-lg bg-gradient-to-br from-secondary via-background to-accent shadow-lg border border-border">
      {/* Soft background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/50 via-transparent to-accent/30" />

      <div className="relative h-full flex items-center justify-center px-8">
        <div className="text-center max-w-4xl">
          {/* Logo */}
          <div className="flex justify-center mb-12 drop-shadow-lg">
            <NirvaLogo
              size="2xl"
              showText={false}
              className="filter brightness-110 contrast-125"
            />
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground font-body tracking-wide drop-shadow-sm">
            Nirva Yoga
          </h1>

          {/* Subheading */}
          <p className="mb-6 text-lg sm:text-xl md:text-2xl text-muted-foreground font-body italic leading-relaxed">
            Find your inner peace through mindful movement
          </p>

          {/* Virtual class info */}
          <p className="mb-8 text-base sm:text-lg text-foreground font-body font-medium">
            Live Virtual Classes via Zoom • Practice from the comfort of home
          </p>

          {/* Pricing badge */}
          <div className="inline-flex items-center px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-accent border-2 border-primary/20 rounded-full text-primary font-body text-sm sm:text-base md:text-lg font-semibold shadow-md hover:shadow-lg transition-shadow">
            <span className="mr-2"></span>
            All Classes $11/session
          </div>

          {/* Key benefits */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground font-body">
            <div className="flex items-center justify-center gap-2">
              <span className="text-primary">✨</span>
              <span>Special attention to all students</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-primary">🎯</span>
              <span>Progress guaranteed</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-primary">👥</span>
              <span>Max 10 students per class</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}