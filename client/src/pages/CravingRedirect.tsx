import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wind, Footprints, Sparkles, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { ImpactStyle, triggerHaptic } from '@/lib/haptics';

const activities = [
  {
    id: 'breathing',
    icon: Wind,
    title: '4-7-8 Breathing',
    description: 'Inhale for 4, hold for 7, exhale for 8',
    duration: '1 min',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'walk',
    icon: Footprints,
    title: 'Quick Walk',
    description: 'Step outside or walk around your space',
    duration: '5 min',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'reset',
    icon: Sparkles,
    title: 'Sensory Reset',
    description: 'Splash cold water, stretch, or drink water',
    duration: '2 min',
    color: 'from-violet-500 to-purple-500',
  },
];

export default function CravingRedirect() {
  const [, setLocation] = useLocation();

  const handleBack = async () => {
    await triggerHaptic(ImpactStyle.Light);
    setLocation('/');
  };

  const handleActivityClick = async (activityId: string) => {
    await triggerHaptic(ImpactStyle.Medium);
    console.log('Activity selected:', activityId);
  };

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
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h1 className="text-4xl font-heading font-bold">Redirect</h1>
          <p className="text-slate-300 text-lg">
            Your brain wants dopamine. Let's give it a healthier hit.
          </p>
        </motion.div>
      </div>

      {/* Quick Activities */}
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-sm uppercase tracking-wider text-slate-400 font-semibold mb-4">
          Quick dopamine replacements
        </h2>

        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 hover-elevate active-elevate-2 cursor-pointer">
              <button
                onClick={() => handleActivityClick(activity.id)}
                className="w-full p-6 text-left"
                data-testid={`activity-${activity.id}`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${activity.color}`}>
                    <activity.icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-heading font-semibold text-white">
                        {activity.title}
                      </h3>
                      <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
                        {activity.duration}
                      </span>
                    </div>
                    <p className="text-slate-300">{activity.description}</p>
                  </div>
                </div>
              </button>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Calm Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-2xl mx-auto mt-8 p-6 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-400/30 rounded-lg text-center"
      >
        <p className="text-slate-300 text-sm">
          Pick one that feels right. Even 60 seconds can shift your state.
        </p>
      </motion.div>
    </div>
  );
}
