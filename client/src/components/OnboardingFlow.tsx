import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface OnboardingData {
  identity: string;
  triggers: string[];
  dailyBaseline: number;
  dailyGoal: number;
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  onClose: () => void;
}

const triggers = [
  { id: 'stressed', label: "When I'm stressed", emoji: '😤' },
  { id: 'bored', label: 'Out of routine / bored', emoji: '🕒' },
  { id: 'social', label: 'With friends', emoji: '🎉' },
  { id: 'meals', label: 'After coffee or meals', emoji: '☕' },
  { id: 'night', label: 'Late at night', emoji: '🌙' }
];

const identityOptions = [
  "...owns my impulses.",
  "...is taking control.",
  "...breathes freely again."
];

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [screen, setScreen] = useState(1);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedIdentity, setSelectedIdentity] = useState('');
  const [customIdentity, setCustomIdentity] = useState('');
  const [dailyBaseline, setDailyBaseline] = useState(15);
  const [showButton, setShowButton] = useState(false);
  const [fadeIndex, setFadeIndex] = useState(0);

  const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Light) => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style });
      } catch (error) {
        console.error('Haptic feedback failed:', error);
      }
    }
  };

  // Screen 1: Fade in animation sequence
  useEffect(() => {
    if (screen === 1) {
      const timers = [
        setTimeout(() => setFadeIndex(1), 500),
        setTimeout(() => setFadeIndex(2), 1500),
        setTimeout(() => setFadeIndex(3), 2500),
        setTimeout(() => setShowButton(true), 3200)
      ];
      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [screen]);

  const handleBegin = async () => {
    await triggerHaptic(ImpactStyle.Medium);
    setScreen(2);
  };

  const toggleTrigger = async (triggerId: string) => {
    await triggerHaptic(ImpactStyle.Light);
    setSelectedTriggers(prev => 
      prev.includes(triggerId) 
        ? prev.filter(t => t !== triggerId)
        : prev.length < 2 ? [...prev, triggerId] : prev
    );
  };

  const handleGotIt = async () => {
    await triggerHaptic(ImpactStyle.Medium);
    setScreen(3);
  };

  const selectIdentity = async (identity: string) => {
    await triggerHaptic(ImpactStyle.Light);
    setSelectedIdentity(identity);
    setCustomIdentity('');
  };

  const handleStartJourney = async () => {
    await triggerHaptic(ImpactStyle.Heavy);
    const finalIdentity = (customIdentity.trim() || selectedIdentity).trim();
    const dailyGoal = Math.round(dailyBaseline * 0.8);
    
    onComplete({
      identity: finalIdentity,
      triggers: selectedTriggers,
      dailyBaseline,
      dailyGoal
    });
  };

  // Calculate dynamic background gradient based on screen (dark to light)
  const getBackgroundClass = () => {
    if (screen === 1) return 'from-slate-950 to-slate-900';
    if (screen === 2) return 'from-slate-900 to-slate-800';
    return 'from-slate-800 to-slate-700';
  };

  const dailyGoal = Math.round(dailyBaseline * 0.8);

  return (
    <div className={`fixed inset-0 bg-gradient-to-b ${getBackgroundClass()} z-50 flex items-center justify-center p-6 transition-all duration-700`}>
      <AnimatePresence mode="wait">
        {/* Screen 1: The Hook */}
        {screen === 1 && (
          <motion.div
            key="screen1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md text-center space-y-8"
          >
            <div className="space-y-6">
              <motion.h2
                className="text-3xl sm:text-4xl font-heading font-bold text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: fadeIndex >= 1 ? 1 : 0, y: fadeIndex >= 1 ? 0 : 20 }}
                transition={{ duration: 0.6 }}
              >
                You're not weak.
              </motion.h2>
              
              <motion.h2
                className="text-3xl sm:text-4xl font-heading font-bold text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: fadeIndex >= 2 ? 1 : 0, y: fadeIndex >= 2 ? 0 : 20 }}
                transition={{ duration: 0.6 }}
              >
                You're just wired.
              </motion.h2>
              
              <motion.p
                className="text-xl sm:text-2xl text-slate-300 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: fadeIndex >= 3 ? 1 : 0, y: fadeIndex >= 3 ? 0 : 20 }}
                transition={{ duration: 0.6 }}
              >
                Unpuff helps you take back control — one craving at a time.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showButton ? 1 : 0, y: showButton ? 0 : 20 }}
              transition={{ duration: 0.4 }}
            >
              <Button
                size="lg"
                onClick={handleBegin}
                className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 py-6 text-lg"
                data-testid="button-begin"
              >
                Let's begin →
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Screen 2: Your Pattern */}
        {screen === 2 && (
          <motion.div
            key="screen2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md space-y-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
                When are you most likely to vape?
              </h2>
              <p className="text-slate-400">Select one or two</p>
            </div>

            <div className="grid gap-3">
              {triggers.map((trigger) => {
                const isSelected = selectedTriggers.includes(trigger.id);
                return (
                  <button
                    key={trigger.id}
                    onClick={() => toggleTrigger(trigger.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left flex items-center gap-3 ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-400/10 scale-105 shadow-lg shadow-cyan-500/20'
                        : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                    }`}
                    data-testid={`trigger-${trigger.id}`}
                  >
                    <span className="text-3xl">{trigger.emoji}</span>
                    <span className={`text-base font-medium ${
                      isSelected ? 'text-white' : 'text-slate-300'
                    }`}>
                      {trigger.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {selectedTriggers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center"
                >
                  <Button
                    size="lg"
                    onClick={handleGotIt}
                    className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 py-6 text-lg"
                    data-testid="button-got-it"
                  >
                    Got it →
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Screen 3: Your Commitment */}
        {screen === 3 && (
          <motion.div
            key="screen3"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md space-y-8"
          >
            {/* Step 1: Identity */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white text-center">
                I am someone who…
              </h2>

              <div className="grid gap-3">
                {identityOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => selectIdentity(option)}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedIdentity === option
                        ? 'border-violet-400 bg-violet-400/10 scale-105 shadow-lg shadow-violet-500/20'
                        : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                    }`}
                    data-testid={`identity-${option.substring(1, 10)}`}
                  >
                    <span className={`text-base font-medium ${
                      selectedIdentity === option ? 'text-white' : 'text-slate-300'
                    }`}>
                      {option}
                    </span>
                  </button>
                ))}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-800 px-2 text-slate-400">Or write your own</span>
                </div>
              </div>

              <Input
                placeholder="Type your own version..."
                value={customIdentity}
                onChange={(e) => {
                  setCustomIdentity(e.target.value);
                  if (e.target.value.trim()) {
                    setSelectedIdentity('');
                  }
                }}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                data-testid="input-custom-identity"
              />
              {!selectedIdentity && !customIdentity.trim() && (
                <p className="text-xs text-slate-400 text-center mt-2">
                  Choose an option above or write your own to continue
                </p>
              )}
            </div>

            {/* Step 2: Daily Baseline with immediate feedback display */}
            <AnimatePresence>
              {(selectedIdentity || customIdentity.trim()) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h3 className="text-xl font-heading font-semibold text-white text-center">
                      How many times do you typically vape in a day?
                    </h3>

                    <div className="text-center">
                      <div className="text-6xl font-bold text-cyan-400 mb-4">
                        {dailyBaseline}
                      </div>
                      <Slider
                        value={[dailyBaseline]}
                        onValueChange={(values) => setDailyBaseline(values[0])}
                        min={0}
                        max={50}
                        step={1}
                        className="w-full"
                        data-testid="slider-baseline"
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-2">
                        <span>0</span>
                        <span>50</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-cyan-400/30 rounded-lg p-4 text-center">
                      <p className="text-slate-300 text-sm mb-1">Your first mission:</p>
                      <p className="text-white font-semibold text-lg">
                        Stay under {dailyGoal} puffs today
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      size="lg"
                      onClick={handleStartJourney}
                      className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 py-6 text-lg"
                      data-testid="button-start-journey"
                    >
                      Start My Journey
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
