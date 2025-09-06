interface FooterProps {
  onShowTerms: () => void;
  onShowPrivacy: () => void;
}

export function Footer({ onShowTerms, onShowPrivacy }: FooterProps) {
  return (
    <footer className="text-center py-8 border-t border-border">
      <p className="text-muted-foreground mb-4">
        Follow us{" "}
        <a 
          href="https://instagram.com/nirvayogastudio" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          @NirvaYogaStudio
        </a>
      </p>
      <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
        <button 
          onClick={onShowTerms}
          className="hover:text-primary transition-colors"
        >
          Terms of Service
        </button>
        <span>•</span>
        <button 
          onClick={onShowPrivacy}
          className="hover:text-primary transition-colors"
        >
          Privacy Policy
        </button>
        <span>•</span>
        <span>© 2025 Nirva Yoga Studio</span>
      </div>
    </footer>
  );
}