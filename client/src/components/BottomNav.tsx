import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { User, Waves } from "lucide-react";
import { ImpactStyle } from "@capacitor/haptics";
import { triggerHaptic } from "@/lib/haptics";

interface BottomNavProps {
  onPanicClick: () => void;
}

export default function BottomNav({ onPanicClick }: BottomNavProps) {
  const [location, setLocation] = useLocation();

  const handleNavClick = async (path: string) => {
    await triggerHaptic(ImpactStyle.Light);
    setLocation(path);
  };

  const handlePanicClick = async () => {
    await triggerHaptic(ImpactStyle.Medium);
    onPanicClick();
  };

  const isActive = (path: string) => location === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="relative h-16 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700">
        <div className="flex items-center justify-around h-full px-4 relative">
          {/* Left: Craving Redirect */}
          <button
            onClick={() => handleNavClick("/redirect")}
            className={`flex flex-col items-center justify-center space-y-1 transition-all ${
              isActive("/redirect") ? "text-cyan-400" : "text-slate-400"
            }`}
            data-testid="nav-redirect"
          >
            <Waves
              className={`w-6 h-6 ${
                isActive("/redirect")
                  ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                  : ""
              }`}
            />
            <span className="text-[10px] lowercase font-medium">redirect</span>
          </button>

          {/* Center: Panic Button (Floating) */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-6">
            <motion.button
              onClick={handlePanicClick}
              className="relative w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-500 shadow-lg shadow-cyan-500/50 flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 10px 30px rgba(34, 211, 238, 0.4)",
                  "0 10px 40px rgba(34, 211, 238, 0.6)",
                  "0 10px 30px rgba(34, 211, 238, 0.4)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileTap={{ scale: 0.95 }}
              data-testid="nav-panic"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8 text-white"
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </motion.button>
          </div>

          {/* Right: Profile */}
          <button
            onClick={() => handleNavClick("/profile")}
            className={`flex flex-col items-center justify-center space-y-1 transition-all ${
              isActive("/profile") ? "text-cyan-400" : "text-slate-400"
            }`}
            data-testid="nav-profile"
          >
            <User
              className={`w-6 h-6 ${
                isActive("/profile")
                  ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                  : ""
              }`}
            />
            <span className="text-[10px] lowercase font-medium">profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
