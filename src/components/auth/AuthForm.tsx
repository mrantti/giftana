
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { Gift } from 'lucide-react';

const AuthForm = () => {
  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('');
  
  // Form error states
  const [loginEmailError, setLoginEmailError] = useState('');
  const [loginPasswordError, setLoginPasswordError] = useState('');
  const [registerNameError, setRegisterNameError] = useState('');
  const [registerEmailError, setRegisterEmailError] = useState('');
  const [registerPasswordError, setRegisterPasswordError] = useState('');
  const [registerPasswordConfirmError, setRegisterPasswordConfirmError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setLoginEmailError('');
    setLoginPasswordError('');
    
    // Basic validation
    let isValid = true;
    
    if (!loginEmail) {
      setLoginEmailError('Email is required');
      isValid = false;
    }
    
    if (!loginPassword) {
      setLoginPasswordError('Password is required');
      isValid = false;
    }
    
    if (!isValid) return;
    
    const success = await login(loginEmail, loginPassword);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setRegisterNameError('');
    setRegisterEmailError('');
    setRegisterPasswordError('');
    setRegisterPasswordConfirmError('');
    
    // Basic validation
    let isValid = true;
    
    if (!registerName) {
      setRegisterNameError('Name is required');
      isValid = false;
    }
    
    if (!registerEmail) {
      setRegisterEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(registerEmail)) {
      setRegisterEmailError('Email is invalid');
      isValid = false;
    }
    
    if (!registerPassword) {
      setRegisterPasswordError('Password is required');
      isValid = false;
    } else if (registerPassword.length < 6) {
      setRegisterPasswordError('Password must be at least 6 characters');
      isValid = false;
    }
    
    if (registerPassword !== registerPasswordConfirm) {
      setRegisterPasswordConfirmError('Passwords do not match');
      isValid = false;
    }
    
    if (!isValid) return;
    
    const success = await register(registerName, registerEmail, registerPassword);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center p-2 bg-giftana-teal/10 rounded-full mb-2">
          <Gift className="h-6 w-6 text-giftana-teal" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight font-serif">Giftana</h1>
        <p className="text-muted-foreground mt-1">Thoughtful, made simple.</p>
      </div>
      
      <Card className="border-none shadow-lg">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="p-6">
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className={loginEmailError ? 'border-destructive' : ''}
                  />
                  {loginEmailError && (
                    <p className="text-xs text-destructive">{loginEmailError}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Password</Label>
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                      Forgot password?
                    </Button>
                  </div>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className={loginPasswordError ? 'border-destructive' : ''}
                  />
                  {loginPasswordError && (
                    <p className="text-xs text-destructive">{loginPasswordError}</p>
                  )}
                </div>
                
                <Button type="submit" className="w-full bg-giftana-teal hover:bg-giftana-teal/90" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
                
                <div className="text-center text-sm text-muted-foreground">
                  <span>Don't have an account?</span>{' '}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-giftana-teal"
                    onClick={() => setActiveTab('register')}
                  >
                    Sign up
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input
                    id="register-name"
                    placeholder="John Doe"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className={registerNameError ? 'border-destructive' : ''}
                  />
                  {registerNameError && (
                    <p className="text-xs text-destructive">{registerNameError}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="you@example.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className={registerEmailError ? 'border-destructive' : ''}
                  />
                  {registerEmailError && (
                    <p className="text-xs text-destructive">{registerEmailError}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className={registerPasswordError ? 'border-destructive' : ''}
                  />
                  {registerPasswordError && (
                    <p className="text-xs text-destructive">{registerPasswordError}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password-confirm">Confirm Password</Label>
                  <Input
                    id="register-password-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={registerPasswordConfirm}
                    onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                    className={registerPasswordConfirmError ? 'border-destructive' : ''}
                  />
                  {registerPasswordConfirmError && (
                    <p className="text-xs text-destructive">{registerPasswordConfirmError}</p>
                  )}
                </div>
                
                <Button type="submit" className="w-full bg-giftana-teal hover:bg-giftana-teal/90" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
                
                <div className="text-center text-sm text-muted-foreground">
                  <span>Already have an account?</span>{' '}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-giftana-teal"
                    onClick={() => setActiveTab('login')}
                  >
                    Sign in
                  </Button>
                </div>
              </form>
            </TabsContent>
          </CardContent>
        </Tabs>
        
        <CardFooter className="flex flex-col space-y-4 px-6 pb-6 pt-0">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Button variant="outline" className="space-x-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              <span>Google</span>
            </Button>
          </div>
          
          <p className="px-8 text-center text-xs text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a href="/terms" className="underline underline-offset-4 hover:text-giftana-teal">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline underline-offset-4 hover:text-giftana-teal">
              Privacy Policy
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AuthForm;
