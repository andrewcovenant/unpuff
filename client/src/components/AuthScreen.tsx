import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useLogin, useSignup } from '@/hooks/useAuth';
import { AuthError, NetworkError } from '@/services/errors';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [error, setError] = useState<string | null>(null);

  // Sign in form state
  const [signInUsername, setSignInUsername] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign up form state
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');

  // React Query mutation hooks
  const loginMutation = useLogin();
  const signupMutation = useSignup();

  const loading = loginMutation.isPending || signupMutation.isPending;

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
    setSignInUsername('');
    setSignInPassword('');
    setSignUpUsername('');
    setSignUpPassword('');
    setSignUpConfirmPassword('');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!signInUsername.trim() || !signInPassword.trim()) {
      setError('Please enter both username and password');
      return;
    }

    try {
      await triggerHaptic(ImpactStyle.Medium);
      await loginMutation.mutateAsync({
        username: signInUsername.trim(),
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    if (!signUpUsername.trim() || !signUpPassword.trim() || !signUpConfirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (signUpUsername.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (signUpPassword.length < 3) {
      setError('Password must be at least 3 characters');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await triggerHaptic(ImpactStyle.Medium);
      await signupMutation.mutateAsync({
        username: signUpUsername.trim(),
        password: signUpPassword,
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
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Username"
                      value={signInUsername}
                      onChange={(e) => setSignInUsername(e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                      disabled={loading}
                      autoComplete="username"
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
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Username"
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

