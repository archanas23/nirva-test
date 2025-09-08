import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Calendar, Clock, User, BookOpen, Plus } from "lucide-react";

interface UserAccountProps {
  user: {
    email: string;
    name?: string;
    classPacks: {
      singleClasses: number;
      fivePack: number;
      tenPack: number;
    };
  } | null;
  onLogout: () => void;
  onNavigateToClasses?: () => void;
  onNavigateToPackages?: () => void;
}

export function UserAccount({ user, onLogout, onNavigateToClasses, onNavigateToPackages }: UserAccountProps) {
  if (!user) return null;

  const totalClasses = user.classPacks.singleClasses + user.classPacks.fivePack + user.classPacks.tenPack;

  return (
    <div className="space-y-6 p-1">
      {/* Account Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>My Account</span>
            <Button variant="destructive" size="sm" onClick={onLogout}>
              Logout
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            {user.name && (
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Class Packages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            My Class Packages
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {user.classPacks.singleClasses > 0 && (
              <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <p className="font-medium text-blue-900">Single Classes</p>
                  <p className="text-sm text-blue-700">Individual purchases</p>
                </div>
                <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
                  {user.classPacks.singleClasses} classes
                </Badge>
              </div>
            )}
            
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">5-Class Package</p>
                <p className="text-sm text-muted-foreground">Never expires</p>
              </div>
              <Badge variant={user.classPacks.fivePack > 0 ? "default" : "secondary"}>
                {user.classPacks.fivePack} classes
              </Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">10-Class Package</p>
                <p className="text-sm text-muted-foreground">Never expires</p>
              </div>
              <Badge variant={user.classPacks.tenPack > 0 ? "default" : "secondary"}>
                {user.classPacks.tenPack} classes
              </Badge>
            </div>
          </div>
          
          <Separator />
          
          <div className="text-center p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-primary text-3xl font-bold">{totalClasses}</p>
            <p className="text-sm text-muted-foreground">Classes Remaining</p>
            {totalClasses > 0 && (
              <p className="text-xs text-primary/80 mt-1">Ready to book!</p>
            )}
            {totalClasses === 0 && (
              <p className="text-xs text-muted-foreground mt-1">Purchase more to continue</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {totalClasses > 0 ? (
            <div className="space-y-3">
              <Button 
                onClick={onNavigateToClasses} 
                className="w-full justify-start"
                size="lg"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book a Class ({totalClasses} classes available)
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                ✨ Use your remaining classes to book any available class
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <Button 
                onClick={onNavigateToPackages} 
                className="w-full justify-start"
                size="lg"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Purchase Class Packages
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                🧘‍♀️ Buy packages to start booking classes
              </p>
            </div>
          )}
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={onNavigateToClasses} 
              variant="outline" 
              size="sm"
              className="justify-start"
            >
              <Calendar className="w-4 h-4 mr-2" />
              View Schedule
            </Button>
            <Button 
              onClick={onNavigateToPackages} 
              variant="outline" 
              size="sm"
              className="justify-start"
            >
              <Plus className="w-4 h-4 mr-2" />
              Buy Packages
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Package Info */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>✨ Class packages never expire and can be used anytime!</p>
            <p>🧘‍♀️ When you book a class, it will be deducted from your packages automatically.</p>
            <p>💰 Single classes can be paid via Zelle ($11 each).</p>
            <p>🚫 All payments are final - no refunds policy applies.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}