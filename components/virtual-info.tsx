import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Monitor, Wifi, Home, Camera } from "lucide-react";

export function VirtualInfo() {
  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto">
        <h2 className="mb-6 text-center font-heading">Practice Yoga From Your Home</h2>
        <p className="mb-4 text-muted-foreground text-center max-w-3xl mx-auto font-body">
          Join Nirva Yoga's live virtual classes via Zoom and experience the benefits of guided instruction 
          from the comfort and privacy of your own space. Our interactive online format allows for personalized 
          attention while maintaining the community feel of a traditional studio.
        </p>
        
        <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20 max-w-3xl mx-auto">
          <p className="text-sm text-center">
            <strong>Personal Attention Guarantee:</strong> With small class sizes and experienced instructors, 
            we ensure every student receives individual guidance and modifications to guarantee progress 
            in both physical strength and mental well-being.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Monitor className="w-5 h-5 text-primary" />
              <h4 className="font-heading">Live Zoom Classes</h4>
            </div>
            <p className="text-sm text-muted-foreground font-body">
              Interactive sessions with real-time guidance and modifications
            </p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Camera className="w-5 h-5 text-primary" />
              <h4>Camera Optional</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Choose to be seen for personalized adjustments or practice privately
            </p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Home className="w-5 h-5 text-primary" />
              <h4>Your Sacred Space</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Practice in your own environment with just a yoga mat and water
            </p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Wifi className="w-5 h-5 text-primary" />
              <h4>Easy Access</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Simple Zoom link sent after booking - no special apps required
            </p>
          </Card>
        </div>
        
        <div className="bg-muted p-6 rounded-lg max-w-2xl mx-auto">
          <h4 className="mb-3 text-center">What You'll Need:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Yoga mat (or towel/carpet)</li>
            <li>• Comfortable space to move (about 6x3 feet)</li>
            <li>• Stable internet connection</li>
            <li>• Computer, tablet, or phone with camera (optional)</li>
            <li>• Water bottle and optional props (blocks, strap)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}