import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus } from "lucide-react";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Capacitor } from "@capacitor/core";
import { formatDistanceToNow } from "date-fns";

interface PuffCounterProps {
  dailyLimit?: number;
  onCountChange?: (count: number) => void;
}

const PUFF_COUNT_KEY = "unpuff-daily-count";
const LAST_PUFF_TIME_KEY = "unpuff-last-puff-time";

export default function PuffCounter({
  dailyLimit = 10,
  onCountChange,
}: PuffCounterProps) {
  const [count, setCount] = useState(0);
  const [lastPuffTime, setLastPuffTime] = useState<Date | null>(null);
  const [todayDate] = useState(() => new Date().toLocaleDateString());

  // Load initial state
  useEffect(() => {
    const savedCount = localStorage.getItem(PUFF_COUNT_KEY);
    const savedTime = localStorage.getItem(LAST_PUFF_TIME_KEY);

    // Check if the saved count is for today
    const savedDate = localStorage.getItem("unpuff-last-date");

    if (savedDate === todayDate) {
      if (savedCount) {
        const c = parseInt(savedCount, 10);
        setCount(c);
        onCountChange?.(c);
      }
      if (savedTime) setLastPuffTime(new Date(savedTime));
    } else {
      // New day, reset count
      localStorage.setItem("unpuff-last-date", todayDate);
      localStorage.removeItem(PUFF_COUNT_KEY);
      localStorage.removeItem(LAST_PUFF_TIME_KEY);
    }
  }, []);

  // Persist state
  useEffect(() => {
    localStorage.setItem(PUFF_COUNT_KEY, count.toString());
    localStorage.setItem("unpuff-last-date", todayDate);
    if (lastPuffTime) {
      localStorage.setItem(LAST_PUFF_TIME_KEY, lastPuffTime.toISOString());
    }
  }, [count, lastPuffTime, todayDate]);

  const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Light) => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style });
      } catch (error) {
        console.error("Haptic feedback failed:", error);
      }
    }
  };

  const handleIncrement = async () => {
    await triggerHaptic(ImpactStyle.Medium);
    const newCount = count + 1;
    setCount(newCount);
    setLastPuffTime(new Date());
    onCountChange?.(newCount);
  };

  const handleDecrement = async () => {
    await triggerHaptic(ImpactStyle.Light);
    const newCount = Math.max(0, count - 1);
    setCount(newCount);
    onCountChange?.(newCount);
  };

  const progressPercentage = Math.min((count / dailyLimit) * 100, 100);
  const isOverLimit = count > dailyLimit;
  const isApproachingLimit = count >= dailyLimit * 0.7 && count <= dailyLimit;

  const getCircleColor = () => {
    if (isOverLimit) return "var(--error)"; // Red/Error
    if (isApproachingLimit) return "var(--warning)"; // Amber/Warning
    return "var(--success)"; // Green/Success
  };

  const getTextColor = () => {
    if (isOverLimit) return "text-error";
    if (isApproachingLimit) return "text-warning";
    return "text-success";
  };

  return (
    <Card className="p-6 relative overflow-hidden border-none shadow-none bg-transparent">
      {/* Clean Hero Layout */}
      <div className="relative w-64 h-64 mx-auto mb-8">
        {/* Progress Ring Visual */}
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="hsl(var(--muted))"
            strokeWidth="6"
            fill="none"
            className="opacity-20"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={getCircleColor()}
            strokeWidth="6"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${
              2 * Math.PI * 45 * (1 - progressPercentage / 100)
            }`}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-6xl font-bold font-heading ${getTextColor()}`}>
            {count}
          </span>
          <span className="text-sm text-muted-foreground mt-1 font-medium">
            / {dailyLimit} goal
          </span>

          {/* Time since last puff */}
          {lastPuffTime && (
            <div className="absolute -bottom-8 left-0 right-0 text-center">
              <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                {formatDistanceToNow(lastPuffTime)} ago
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Simplified Controls */}
      <div className="flex items-center justify-center gap-8 mt-4">
        <Button
          size="icon"
          variant="ghost"
          className="h-12 w-12 rounded-full border border-input hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={handleDecrement}
          disabled={count === 0}
          data-testid="button-decrement"
        >
          <Minus className="h-5 w-5" />
        </Button>

        <Button
          size="lg"
          className="h-20 w-20 rounded-full shadow-xl bg-gradient-to-br from-primary to-primary/80 hover:scale-105 transition-all duration-200 active:scale-95"
          onClick={handleIncrement}
          data-testid="button-increment"
        >
          <Plus className="h-8 w-8 text-background" />
        </Button>

        {/* Spacer to balance layout since we removed reset */}
        <div className="w-12" />
      </div>

      <p className="text-xs text-muted-foreground text-center mt-8 opacity-40">
        Long press + to add context
      </p>

      {isOverLimit && (
        <div className="mt-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 animate-in fade-in slide-in-from-bottom-2">
          <p className="text-xs text-destructive font-medium text-center">
            Over daily goal. You've got this.
          </p>
        </div>
      )}
    </Card>
  );
}
