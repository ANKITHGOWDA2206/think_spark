
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, GraduationCap, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAppContext, UserRole } from '@/context/AppContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const { toast } = useToast();
  const { login } = useAppContext();
  const navigate = useNavigate();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, we'd validate credentials here
    login(role);
    
    toast({
      title: "Success!",
      description: `Welcome back to ThinkSpark, you are logged in as a ${role}.`,
    });
    
    navigate('/');
  };
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-flex justify-center">
            <Brain className="h-12 w-12 text-primary animate-float" />
          </div>
          <h1 className="mt-4 text-3xl font-bold">Welcome to ThinkSpark</h1>
          <p className="mt-2 text-gray-600">Log in to continue your learning journey</p>
        </div>
        
        <Card>
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle>Log In</CardTitle>
              <CardDescription>
                Enter your details to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>I am a:</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Button 
                    type="button"
                    variant={role === 'student' ? 'default' : 'outline'}
                    className="flex items-center justify-center h-16"
                    onClick={() => setRole('student')}
                  >
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Student
                  </Button>
                  <Button 
                    type="button"
                    variant={role === 'teacher' ? 'default' : 'outline'}
                    className="flex items-center justify-center h-16"
                    onClick={() => setRole('teacher')}
                  >
                    <User className="mr-2 h-5 w-5" />
                    Teacher
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" type="submit">
                Log In
              </Button>
              <div className="mt-4 text-center text-sm">
                <span className="text-gray-600">Don't have an account? </span>
                <a href="#" className="text-primary hover:underline">
                  Sign Up
                </a>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
