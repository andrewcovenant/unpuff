import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useLogin, useSignup, useGoogleSignIn } from '@/hooks/useAuth';
import { AuthError, NetworkError } from '@/services/errors';
import { supabase } from '@/lib/supabase';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [error, setError] = useState<string | null>(null);

  // Sign in form state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign up form state
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');

  // React Query mutation hooks
  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const googleSignInMutation = useGoogleSignIn();

  const loading = loginMutation.isPending || signupMutation.isPending || googleSignInMutation.isPending;

  // Handle OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        onAuthSuccess();
      }
    };

    handleOAuthCallback();
  }, [onAuthSuccess]);

  const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Light) => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style });
      } catch (error) {
        console.error('Haptic feedback failed:', error);
      }
    }
  };

  const handleTabChange = async (value: string) => {
    await triggerHaptic(ImpactStyle.Light);
    setActiveTab(value as 'signin' | 'signup');
    setError(null);
    // Clear forms when switching tabs
    setSignInEmail('');
    setSignInPassword('');
    setSignUpEmail('');
    setSignUpUsername('');
    setSignUpPassword('');
    setSignUpConfirmPassword('');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!signInEmail.trim() || !signInPassword.trim()) {
      setError('Please enter both email and password');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signInEmail.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await triggerHaptic(ImpactStyle.Medium);
      await loginMutation.mutateAsync({
        email: signInEmail.trim(),
        password: signInPassword,
      });

      // Call success callback (mutation hook handles cache invalidation and events)
      onAuthSuccess();
    } catch (error: any) {
      await triggerHaptic(ImpactStyle.Heavy);
      let message = 'Failed to sign in. Please try again.';
      
      if (error instanceof AuthError) {
        message = error.message;
      } else if (error instanceof NetworkError) {
        message = error.message;
      } else if (error?.message) {
        message = error.message;
      }
      
      setError(message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await triggerHaptic(ImpactStyle.Medium);
      await googleSignInMutation.mutateAsync();
      // OAuth redirect will happen, user will be redirected back after authentication
    } catch (error: any) {
      await triggerHaptic(ImpactStyle.Heavy);
      let message = 'Failed to sign in with Google. Please try again.';
      
      if (error instanceof AuthError) {
        message = error.message;
      } else if (error instanceof NetworkError) {
        message = error.message;
      } else if (error?.message) {
        message = error.message;
      }
      
      setError(message);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    if (!signUpEmail.trim() || !signUpPassword.trim() || !signUpConfirmPassword.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signUpEmail.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    if (signUpPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await triggerHaptic(ImpactStyle.Medium);
      await signupMutation.mutateAsync({
        email: signUpEmail.trim(),
        password: signUpPassword,
        username: signUpUsername.trim() || undefined,
      });

      // Call success callback (mutation hook handles cache invalidation and events)
      onAuthSuccess();
    } catch (error: any) {
      await triggerHaptic(ImpactStyle.Heavy);
      let message = 'Failed to create account. Please try again.';
      
      if (error instanceof AuthError) {
        message = error.message;
      } else if (error instanceof NetworkError) {
        message = error.message;
      } else if (error?.message) {
        message = error.message;
      }
      
      setError(message);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-950 to-slate-900 z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2">
                Welcome to Unpuff
              </h1>
              <p className="text-sm text-slate-400">
                Sign in or create an account to continue
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 mb-6">
                <TabsTrigger
                  value="signin"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4 mt-6">
                {/* Google Sign In Button */}
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold border-slate-600"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {loading ? 'Signing in...' : 'Sign in with Gmail'}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full border-slate-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-800/50 px-2 text-slate-400">Or continue with</span>
                  </div>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                      disabled={loading}
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                      disabled={loading}
                      autoComplete="current-password"
                    />
                  </div>
                  
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
                    >
                      <p className="text-sm text-destructive">{error}</p>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In →'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-6">
                {/* Google Sign Up Button */}
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold border-slate-600"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {loading ? 'Signing up...' : 'Sign up with Gmail'}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full border-slate-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-800/50 px-2 text-slate-400">Or continue with</span>
                  </div>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                      disabled={loading}
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Username (optional)"
                      value={signUpUsername}
                      onChange={(e) => setSignUpUsername(e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                      disabled={loading}
                      autoComplete="username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                      disabled={loading}
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                      disabled={loading}
                      autoComplete="new-password"
                    />
                  </div>
                  
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
                    >
                      <p className="text-sm text-destructive">{error}</p>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold"
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Sign Up →'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

