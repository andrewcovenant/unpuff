import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImpactStyle } from '@capacitor/haptics';
import { triggerHaptic } from '@/lib/haptics';
import { useState, useEffect } from 'react';

interface PanicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PanicModal({ isOpen, onClose }: PanicModalProps) {
  const [breathCount, setBreathCount] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setBreathCount(0);
      setIsBreathing(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isBreathing && breathCount < 3) {
      const timer = setTimeout(async () => {
        await triggerHaptic(ImpactStyle.Light);
        setBreathCount(prev => prev + 1);
      }, 6000);
      
      return () => clearTimeout(timer);
    }
  }, [isBreathing, breathCount]);

  const handleClose = async () => {
    await triggerHaptic(ImpactStyle.Light);
    onClose();
  };

  const startBreathing = () => {
    setIsBreathing(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-6"
          data-testid="panic-modal"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
            data-testid="button-close-panic"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-md w-full space-y-8 text-center">
            {!isBreathing ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-heading font-bold text-white">
                    You've got this.
                  </h2>
                  <p className="text-slate-300 text-lg">
                    This craving will pass. Let's ride it out together.
                  </p>
                </div>

                <div className="py-8">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg shadow-cyan-500/50"
                  />
                </div>

                <Button
                  size="lg"
                  onClick={startBreathing}
                  className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 py-6 text-lg w-full"
                  data-testid="button-start-breathing"
                >
                  Start Breathing Exercise
                </Button>

                <p className="text-xs text-slate-500">
                  3 deep breaths to reset your nervous system
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-heading font-semibold text-white">
                    Breathe with me
                  </h3>
                  <p className="text-slate-400">
                    {breathCount < 3 ? 'Follow the circle' : 'Well done!'}
                  </p>
                </div>

                {/* Breathing Circle */}
                <div className="relative w-48 h-48 mx-auto">
                  <motion.div
                    animate={breathCount < 3 ? {
                      scale: [1, 1.5, 1],
                    } : { scale: 1 }}
                    transition={{
                      duration: 6,
                      repeat: breathCount < 3 ? Infinity : 0,
                      ease: 'easeInOut',
                    }}
                    className="w-full h-full rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 shadow-2xl shadow-cyan-500/50"
                  />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.p
                      animate={breathCount < 3 ? {
                        opacity: [0, 1, 1, 1, 0],
                      } : {}}
                      transition={{
                        duration: 6,
                        repeat: breathCount < 3 ? Infinity : 0,
                        times: [0, 0.1, 0.4, 0.6, 1],
                      }}
                      className="text-white font-semibold text-lg"
                    >
                      {breathCount < 3 ? 'Breathe...' : '✓'}
                    </motion.p>
                  </div>
                </div>

                <div className="flex justify-center space-x-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        i < breathCount ? 'bg-cyan-400' : 'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>

                {breathCount >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Button
                      size="lg"
                      onClick={handleClose}
                      className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 py-6 text-lg w-full"
                      data-testid="button-finish-breathing"
                    >
                      I'm Ready
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
