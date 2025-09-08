import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Database, CheckCircle, AlertCircle } from "lucide-react";
import { ClassManagementService } from "../utils/class-management";

export function DatabaseSetup() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeDatabase = async () => {
    try {
      setIsInitializing(true);
      setError(null);
      
      await ClassManagementService.initializeDefaultClasses();
      setIsInitialized(true);
    } catch (err) {
      console.error('Database initialization error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Database Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isInitialized ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span>Database initialized successfully!</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span>Error: {error}</span>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Initialize the database with default class templates. This will create the necessary tables and populate them with your class schedule.
            </p>
            <Button 
              onClick={initializeDatabase}
              disabled={isInitializing}
              className="w-full"
            >
              {isInitializing ? "Initializing..." : "Initialize Database"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
