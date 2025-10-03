import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus, Plus, RotateCcw } from 'lucide-react';

interface PuffCounterProps {
  dailyLimit?: number;
  onCountChange?: (count: number) => void;
}

export default function PuffCounter({ dailyLimit = 10, onCountChange }: PuffCounterProps) {
  const [count, setCount] = useState(0);
  const [todayDate] = useState(() => new Date().toLocaleDateString());

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    onCountChange?.(newCount);
    console.log('Puff count incremented:', newCount);
  };

  const handleDecrement = () => {
    const newCount = Math.max(0, count - 1);
    setCount(newCount);
    onCountChange?.(newCount);
    console.log('Puff count decremented:', newCount);
  };

  const handleReset = () => {
    setCount(0);
    onCountChange?.(0);
    console.log('Puff count reset');
  };

  const progressPercentage = Math.min((count / dailyLimit) * 100, 100);
  const isOverLimit = count > dailyLimit;
  const isApproachingLimit = count >= dailyLimit * 0.7 && count <= dailyLimit;

  const getCircleColor = () => {
    if (isOverLimit) return "#F43F5E"; // Red/Error
    if (isApproachingLimit) return "#F59E0B"; // Amber/Warning
    return "#34D399"; // Green/Success
  };

  const getTextColor = () => {
    if (isOverLimit) return 'text-error';
    if (isApproachingLimit) return 'text-warning';
    return 'text-success';
  };

  const handleManualInput = (value: string) => {
    const newCount = parseInt(value) || 0;
    if (newCount >= 0) {
      setCount(newCount);
      onCountChange?.(newCount);
      console.log('Manual count updated:', newCount);
    }
  };

  return (
    <Card className="p-4 sm:p-6 md:p-8 text-center space-y-4 sm:space-y-6 bg-gradient-to-br from-card to-card/80">
      <div className="space-y-1 sm:space-y-2">
        <h2 className="text-xs sm:text-sm font-medium text-muted-foreground">Today's Count</h2>
        <p className="text-xs text-muted-foreground">{todayDate}</p>
      </div>
      
      {/* Progress Ring Visual */}
      <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={getCircleColor()}
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-5xl sm:text-6xl font-bold font-heading ${getTextColor()}`}>
              {count}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              of {dailyLimit}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Input */}
      <div className="max-w-xs mx-auto">
        <Label htmlFor="manual-count" className="text-xs text-muted-foreground">
          Or enter manually
        </Label>
        <Input
          id="manual-count"
          type="number"
          min="0"
          value={count}
          onChange={(e) => handleManualInput(e.target.value)}
          className="text-center mt-1"
          data-testid="input-manual-count"
        />
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        <Button
          size="icon"
          variant="outline"
          onClick={handleDecrement}
          disabled={count === 0}
          className="h-10 w-10 sm:h-12 sm:w-12"
          data-testid="button-decrement"
        >
          <Minus className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
        
        <Button
          size="lg"
          onClick={handleIncrement}
          className="h-14 w-14 sm:h-16 sm:w-16 rounded-full text-xl font-bold"
          data-testid="button-increment"
        >
          <Plus className="h-7 w-7 sm:h-8 sm:w-8" />
        </Button>
        
        <Button
          size="icon"
          variant="outline"
          onClick={handleReset}
          className="h-10 w-10 sm:h-12 sm:w-12"
          data-testid="button-reset"
        >
          <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </div>

      {isOverLimit && (
        <div className="p-3 sm:p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-xs sm:text-sm text-destructive font-medium">
            You've exceeded your daily limit. Consider using the panic button for support.
          </p>
        </div>
      )}
    </Card>
  );
}