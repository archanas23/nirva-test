    import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Check, Star } from "lucide-react";

interface PackagesSectionProps {
  onPurchasePackage: (packageType: 'single' | 'five' | 'ten') => void;
  user?: {
    email: string;
    name?: string;
    classPacks: {
      fivePack: number;
      tenPack: number;
    };
  } | null;
}

export function PackagesSection({ onPurchasePackage, user }: PackagesSectionProps) {
  const packages = [
    {
      id: 'single',
      name: 'Single Class',
      price: 11.00,
      originalPrice: null,
      savings: 0,
      description: 'Perfect for trying out our classes',
      perClassPrice: '$11.00/class',
      features: [
        'Live virtual class via Zoom',
        'Interactive instruction',
        'Recording available upon request',
        'All levels welcome'
      ],
      popular: false,
      buttonText: 'Book Now - $11',
      priceNote: ''
    },
    {
      id: 'five',
      name: '5-Class Package',
      price: 53.00,
      originalPrice: 55.00,
      savings: 2.00,
      description: 'Great for regular practice',
      perClassPrice: '$10.60/class',
      features: [
        'All single class benefits',
        'Classes never expire',
        'Use anytime you want',
        'Flexible scheduling',
        '4% savings'
      ],
      popular: false,
      buttonText: 'Buy Package - $53',
      priceNote: ''
    },
    {
      id: 'ten',
      name: '10-Class Package',
      price: 105.00,
      originalPrice: 110.00,
      savings: 5.00,
      description: 'Best value for committed students',
      perClassPrice: '$10.50/class',
      features: [
        'All single class benefits',
        'Classes never expire',
        'Use anytime you want',
        'Flexible scheduling',
        '5% savings',
        'Priority booking'
      ],
      popular: true,
      buttonText: 'Buy Package - $105',
      priceNote: ''
    }
  ];

  return (
    <section className="w-full">
      <div className="text-center mb-12">
        <h2 className="mb-4 text-3xl font-heading text-foreground">Class Packages</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto font-body text-lg">
          Choose the package that works best for your yoga journey. All classes include live instruction, 
          recordings, and personal attention from our certified teachers.
        </p>
        
        {/* Private Classes Information */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-6 max-w-2xl mx-auto mt-8 mb-6">
          <h3 className="text-xl font-semibold text-primary mb-2">Private Classes Available</h3>
          <p className="text-muted-foreground mb-3">
            Looking for personalized attention? Book a private one-on-one session with our certified instructors.
          </p>
          <div className="flex items-center justify-center gap-4 text-lg font-semibold">
            <span className="text-primary">$60/hour</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-foreground">Customized to your needs</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Contact us to schedule your private session
          </p>
        </div>
        
        {user && (user.classPacks.fivePack > 0 || user.classPacks.tenPack > 0) && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg max-w-md mx-auto">
            <h4 className="font-medium text-green-800 mb-2">Your Available Classes</h4>
            <div className="text-sm space-y-1">
              {user.classPacks.fivePack > 0 && (
                <p className="text-green-700">5-Class Package: {user.classPacks.fivePack} classes remaining</p>
              )}
              {user.classPacks.tenPack > 0 && (
                <p className="text-green-700">10-Class Package: {user.classPacks.tenPack} classes remaining</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {packages.map((pkg) => (
          <Card 
            key={pkg.id}
            className={`relative transition-all duration-300 hover:shadow-lg ${
              pkg.popular ? 'border-primary shadow-lg scale-105' : ''
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Most Popular
                </div>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-heading">{pkg.name}</CardTitle>
              <p className="text-muted-foreground text-sm font-body">{pkg.description}</p>
              
              <div className="mt-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-bold text-primary">${pkg.price.toFixed(0)}</span>
                  {pkg.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ${pkg.originalPrice.toFixed(0)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 font-body">
                  {pkg.perClassPrice}
                </p>
                <p className="text-xs text-primary font-semibold mt-1">{pkg.priceNote}</p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm font-body">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full mt-6 font-body" 
                variant={pkg.popular ? "default" : "outline"}
                onClick={() => onPurchasePackage(pkg.id as 'single' | 'five' | 'ten')}
              >
                {pkg.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <div className="inline-block p-4 bg-accent rounded-lg border border-primary/20 max-w-2xl">
          <p className="text-sm font-body">
            <strong>Our Guarantee:</strong> All packages include personalized attention from our instructors 
            and guarantee progress in both your physical practice and mental well-being. 
            Classes never expire, so you can practice at your own pace.
          </p>
        </div>
      </div>
    </section>
  );
}