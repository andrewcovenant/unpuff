import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import { ImpactStyle, triggerHaptic } from "@/lib/haptics";

export default function EmailConfirmed() {
  const [, setLocation] = useLocation();

  const handleGoToSignIn = async () => {
    await triggerHaptic(ImpactStyle.Medium);
    setLocation("/");
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-950 to-slate-900 z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <div className="p-8 text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className="mb-6"
            >
              <div className="w-20 h-20 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl font-heading font-bold text-white mb-3"
            >
              Email Confirmed!
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-slate-400 mb-8"
            >
              Your email has been verified successfully. You can now sign in to
              your account.
            </motion.p>

            {/* Sign In Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                size="lg"
                className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold"
                onClick={handleGoToSignIn}
              >
                Sign In →
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
