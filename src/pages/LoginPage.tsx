import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User as UserIcon, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth';
import { MOCK_USERS } from '@shared/mock-data';
import type { User } from '@shared/types';
export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore(s => s.login);
  const handleLogin = (user: User) => {
    login(user);
    navigate('/dashboard');
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-gradient opacity-5 pointer-events-none" />
      <Card className="w-full max-w-md shadow-2xl relative z-10 border-blue-100 dark:border-blue-900">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Login to access Barangay Panipuan services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">Demo: Quick Access</p>
            <div className="grid grid-cols-1 gap-3">
              {MOCK_USERS.map((user) => (
                <Button 
                  key={user.id} 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-12 border-blue-50 hover:bg-blue-50 hover:text-blue-700 transition-all"
                  onClick={() => handleLogin(user)}
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold">{user.name}</div>
                    <div className="text-[10px] text-muted-foreground capitalize">{user.role}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center w-full">
            <span className="text-sm text-muted-foreground">Don't have an account? </span>
            <button className="text-sm font-bold text-primary hover:underline">Contact Barangay Secretary</button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}