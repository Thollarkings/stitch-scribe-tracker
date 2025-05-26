
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const { user, signIn, signUp, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [authLoading, setAuthLoading] = useState(false);

  // Redirect if already authenticated
  if (user && !isLoading) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast.error('Please enter both email and password');
      return;
    }

    setAuthLoading(true);
    try {
      const { error } = await signIn(loginData.email, loginData.password);
      if (error) {
        toast.error(error.message || 'Failed to sign in. Please check your credentials.');
      } else {
        toast.success('Logged in successfully!');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { name, email, password, confirmPassword } = signupData;
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setAuthLoading(true);
    try {
      const { error } = await signUp(email, password, name);
      if (error) {
        toast.error(error.message || 'Failed to sign up');
      } else {
        toast.success('Account created! Please sign in.'); 
        // For Supabase with email confirmation disabled, users can log in immediately
        // For Supabase with email confirmation enabled, users must confirm their email first
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
  <div className="min-h-screen h-screen flex flex-col bg-gradient-to-br from-indigo-300 via-gray-200 to-indigo-400 py-12">
    <div className="container max-w-md mx-auto px-4 flex-1 flex flex-col justify-center">
      <div className="text-center mb-8">
        <img 
          src="logo.png" 
          alt="Tailor's Log Book" 
          className="h-24 w-24 mx-auto rounded-full border-2 border-white/20"
        />
        <h1 className="text-3xl font-bold font-serif mt-4 text-black">Tailor's Log Book</h1>
        <p className="text-gray-900">Sign in to access your client records</p>
      </div>
      
        
        
     <Card className="bg-gray-300/90 border-gray-400 backdrop-blur-sm shadow-[0_70px_100px_-1px_rgba(0,0,0,0.3)]">
          <Tabs defaultValue="login">
<TabsList className="w-full flex gap-1 bg-gray-200 p-1 rounded-lg">
             <TabsTrigger 
    value="login" 
    className="w-full data-[state=active]:bg-indigo-300 shadow-md hover:shadow-lg hover:shadow-gray-900/30 data-[state=active]:text-gray-800 py-2 rounded-md transition-colors"
  >
    Login
  </TabsTrigger>
              <TabsTrigger 
    value="signup" 
    className="w-full bg-emerald-200 shadow-md hover:shadow-lg hover:shadow-gray-900/30 data-[state=active]:bg-green-600 data-[state=active]:text-white py-2 rounded-md transition-colors"
  >
    Sign Up
  </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your.email@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={authLoading}
                  >
                    {authLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>Sign up to start managing your clients</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      type="text" 
                      placeholder="John Doe"
                      value={signupData.name}
                      onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="your.email@example.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input 
                      id="signup-password" 
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={authLoading}
                  >
                    {authLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
