import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { useLocation } from 'wouter';
import { ImpactStyle, triggerHaptic } from '@/lib/haptics';
import { useUserData } from '@/hooks/useUserData';

export default function Profile() {
  const [, setLocation] = useLocation();
  const { data: userData, isLoading } = useUserData();
  const streak = 3;
  const moneySaved = 45.50;

  const handleBack = async () => {
    await triggerHaptic(ImpactStyle.Light);
    setLocation('/');
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white pb-24 px-4" style={{ 
      paddingTop: 'calc(var(--safe-area-inset-top) + 1.5rem)',
      paddingBottom: 'calc(6rem + var(--safe-area-inset-bottom))'
    }}>
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-6"
          data-testid="button-back-profile"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h1 className="text-4xl font-heading font-bold">Profile</h1>
          <p className="text-slate-300 text-lg">Your journey at a glance</p>
        </motion.div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Identity Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border-cyan-400/30 p-6">
            <p className="text-sm text-slate-400 mb-2">Your identity</p>
            <h2 className="text-2xl font-heading font-semibold text-white" data-testid="text-identity">
              I am someone who {userData?.identity || '...'}
            </h2>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center space-x-3 mb-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <p className="text-sm text-slate-400">Streak</p>
              </div>
              <p className="text-3xl font-bold text-white" data-testid="text-streak">
                {streak} days
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center space-x-3 mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <p className="text-sm text-slate-400">Saved</p>
              </div>
              <p className="text-3xl font-bold text-white" data-testid="text-money-saved">
                ${moneySaved.toFixed(2)}
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="w-5 h-5 text-violet-400" />
                <p className="text-sm text-slate-400">Daily Goal</p>
              </div>
              <p className="text-3xl font-bold text-white" data-testid="text-daily-goal">
                {userData?.dailyGoal || 0}
              </p>
            </Card>
          </motion.div>
        </div>

        {/* Goal Details */}
        {userData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-lg font-heading font-semibold text-white mb-4">
                Your commitment
              </h3>
              <div className="space-y-3 text-slate-300">
                <div className="flex justify-between">
                  <span>Baseline (before Unpuff):</span>
                  <span className="font-semibold text-white">{userData.dailyBaseline} puffs</span>
                </div>
                <div className="flex justify-between">
                  <span>Daily goal:</span>
                  <span className="font-semibold text-cyan-400">{userData.dailyGoal} puffs</span>
                </div>
                <div className="flex justify-between">
                  <span>Reduction target:</span>
                  <span className="font-semibold text-green-400">
                    {Math.round(((userData.dailyBaseline - userData.dailyGoal) / userData.dailyBaseline) * 100)}%
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Account Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-heading font-semibold text-white mb-3">
              Cloud Sync
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Sign up to save your progress across devices and never lose your streak.
            </p>
            <Button
              variant="outline"
              className="w-full"
              disabled
              data-testid="button-create-account"
            >
              Coming Soon
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
