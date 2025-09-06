import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface UserAccountProps {
  user: {
    email: string;
    name?: string;
    classPacks: {
      fivePack: number;
      tenPack: number;
    };
  } | null;
  onLogout: () => void;
}

export function UserAccount({ user, onLogout }: UserAccountProps) {
  if (!user) return null;

  const totalClasses = user.classPacks.fivePack + user.classPacks.tenPack;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>My Account</span>
          <Button variant="outline" size="sm" onClick={onLogout}>
            Logout
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="mb-3">Class Packages</h4>
          <div className="space-y-3">
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
        </div>
        
        <Separator />
        
        <div className="text-center p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-primary text-2xl font-medium">{totalClasses}</p>
          <p className="text-sm text-muted-foreground">Classes Remaining</p>
          {totalClasses > 0 && (
            <p className="text-xs text-primary/80 mt-1">Ready to book!</p>
          )}
          {totalClasses === 0 && (
            <p className="text-xs text-muted-foreground mt-1">Purchase more to continue</p>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground text-center">
          <p>✨ Class packages never expire and can be used anytime!</p>
          <p className="mt-1">🧘‍♀️ When you book a class, it will be deducted from your packages automatically.</p>
        </div>
      </CardContent>
    </Card>
  );
}