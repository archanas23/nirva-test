interface NirvaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  showText?: boolean;
}

export function NirvaLogo({ className = "", size = "md", showText = true }: NirvaLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16",
    xl: "w-24 h-24",
    "2xl": "w-32 h-32",
    "3xl": "w-40 h-40"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
    "2xl": "text-4xl",
    "3xl": "text-5xl"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className={sizeClasses[size]}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simple lotus petals */}
        <g>
          {/* Top petal - Subtle blue-gray */}
          <ellipse cx="50" cy="35" rx="6" ry="15" fill="#A5B4B8" />
          
          {/* Top right petal - Soft blue-gray */}
          <ellipse cx="62" cy="42" rx="6" ry="15" fill="#95ADB2" transform="rotate(45 62 42)" />
          
          {/* Bottom right petal - Bright pink */}
          <ellipse cx="62" cy="58" rx="6" ry="15" fill="#FF6B9D" transform="rotate(90 62 58)" />
          
          {/* Bottom petal - Vibrant pink */}
          <ellipse cx="50" cy="65" rx="6" ry="15" fill="#F472B6" transform="rotate(135 50 65)" />
          
          {/* Bottom left petal - Bright pink */}
          <ellipse cx="38" cy="58" rx="6" ry="15" fill="#FF6B9D" transform="rotate(180 38 58)" />
          
          {/* Top left petal - Subtle blue */}
          <ellipse cx="38" cy="42" rx="6" ry="15" fill="#95ADB2" transform="rotate(-45 38 42)" />
        </g>
        
        {/* Center sun/lotus center */}
        <circle cx="50" cy="50" r="8" fill="#E879A6" />
        <circle cx="50" cy="50" r="5" fill="#F298BC" />
        <circle cx="50" cy="50" r="2" fill="#F8B7D1" />
      </svg>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`tracking-wide ${textSizeClasses[size]} font-serif`} style={{
            fontWeight: '300',
            letterSpacing: '0.05em',
            color: 'var(--color-muted-foreground)'
          }}>
            Nirva
          </span>
          <span className="font-serif tracking-wider text-muted-foreground" style={{
            fontSize: 'var(--font-size-xs)',
            fontWeight: '400',
            letterSpacing: '0.15em'
          }}>
            Y O G A
          </span>
        </div>
      )}
    </div>
  );
}