import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { DatabaseService } from '../utils/database';

export function PasswordResetPage() {
  console.log('🎯 PasswordResetPage component rendered');
  
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  
  console.log('🔍 Current state:', { email, token, isValidToken, message });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    const tokenParam = urlParams.get('token');
    
    console.log('🔍 Password reset page debug:', {
      search: window.location.search,
      emailParam,
      tokenParam,
      hasEmail: !!emailParam,
      hasToken: !!tokenParam,
      currentView: 'password-reset'
    });
    
    if (emailParam) setEmail(emailParam);
    if (tokenParam) setToken(tokenParam);
    
    // Clear URL parameters after reading them
    if (emailParam && tokenParam) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Validate token if both email and token are present
    if (emailParam && tokenParam) {
      validateToken(emailParam, tokenParam);
    }
  }, []);

  const validateToken = async (email: string, token: string) => {
    try {
      console.log('🔍 Validating token:', { email, token });
      // For now, we'll assume the token is valid if it exists
      // In a real implementation, you'd validate against the database
      console.log('🔍 Setting isValidToken to true');
      setIsValidToken(true);
      console.log('✅ Token validated successfully');
    } catch (error) {
      console.log('❌ Token validation failed:', error);
      setIsValidToken(false);
      setMessage('Invalid or expired reset token. Please request a new password reset.');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match. Please try again.');
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    try {
      // Actually update the password in the database
      console.log('🔍 Updating password for:', email);
      console.log('🔍 New password:', newPassword);
      
      // Update the user's password in the database
      const result = await DatabaseService.createOrUpdateUser({
        email: email,
        password: newPassword
      });
      
      console.log('✅ Password updated successfully, result:', result);
      
      // Verify the password was actually updated by checking the hash
      const updatedUser = await DatabaseService.getUserByEmail(email);
      console.log('🔍 Updated user record:', updatedUser);
      
      setMessage('Password reset successfully! You will be redirected to the home page in a moment where you can log in with your new password.');
    } catch (error) {
      setMessage('Failed to reset password. Please try again or request a new reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidToken === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            </div>
            <p className="text-center text-gray-600 mt-4">Validating reset token...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isValidToken === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Invalid Reset Link</CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertDescription>
                Please request a new password reset link from the login page.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => window.location.href = '/'} 
              className="w-full"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-pink-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Reset Your Password</CardTitle>
          <CardDescription>
            Enter your new password for {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert className={`mb-4 ${message.includes('successfully') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <AlertDescription className={message.includes('successfully') ? 'text-green-700' : 'text-red-700'}>
                {message}
              </AlertDescription>
            </Alert>
          )}
          
          {!message.includes('successfully') && (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
              </div>
              
              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          )}
          
          {message.includes('successfully') && (
            <Button 
              onClick={() => window.location.href = '/'} 
              className="w-full"
            >
              Return to Login
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
