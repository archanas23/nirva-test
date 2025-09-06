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
      price: 10.00,
      originalPrice: null,
      savings: 0,
      description: 'Perfect for trying out our classes - $10/class',
      features: [
        'Live virtual class via Zoom',
        'Interactive instruction',
        'Recording available upon request',
        'All levels welcome'
      ],
      popular: false,
      buttonText: 'Book Now',
      priceNote: 'inc. processing'
    },
    {
      id: 'five',
      name: '5-Class Package',
      price: 48.00,
      originalPrice: 50.00,
      savings: 2.00,
      description: 'Great for regular practice - $9.60/class',
      features: [
        'All single class benefits',
        'Classes never expire',
        'Use anytime you want',
        'Flexible scheduling'
      ],
      popular: false,
      buttonText: 'Get 5 Classes',
      priceNote: 'Save $2'
    },
    {
      id: 'ten',
      name: '10-Class Package',
      price: 95.00,
      originalPrice: 100.00,
      savings: 5.00,
      description: 'Best value for committed practice - $9.50/class',
      features: [
        'All package benefits',
        'Maximum savings',
        'Classes never expire',
        'Priority booking',
        'Free consultation call'
      ],
      popular: true,
      buttonText: 'Get 10 Classes',
      priceNote: 'Save $5 - Best Value!'
    }
  ];

  return (
    <section className="w-full">
      <div className="text-center mb-12">
        <h2 className="mb-4 font-heading" style={{ fontSize: 'var(--font-size-4xl)' }}>Class Packages</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto font-body" style={{ fontSize: 'var(--font-size-lg)' }}>
          Choose the package that works best for your yoga journey. All classes are $10/class and include live instruction, 
          recordings, and personal attention from our certified teachers.
        </p>
        
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
              <CardTitle className="text-xl">{pkg.name}</CardTitle>
              <p className="text-muted-foreground text-sm">{pkg.description}</p>
              
              <div className="mt-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold">${pkg.price.toFixed(0)}</span>
                  {pkg.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ${pkg.originalPrice.toFixed(0)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{pkg.priceNote}</p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full mt-6" 
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
          <p className="text-sm">
            <strong>Our Guarantee:</strong> All packages include personalized attention from our instructors 
            and guarantee progress in both your physical practice and mental well-being. 
            Classes never expire, so you can practice at your own pace.
          </p>
        </div>
      </div>
    </section>
  );
}