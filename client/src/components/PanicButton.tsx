import { Button } from '@/components/ui/button';
import { AlertCircle, Heart } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

interface PanicButtonProps {
  onClick?: () => void;
  className?: string;
}

export default function PanicButton({ onClick, className = "" }: PanicButtonProps) {
  const handleClick = async () => {
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    }
    console.log('Panic button activated - opening support modal');
    onClick?.();
  };

  return (
    <Button
      onClick={handleClick}
      size="lg"
      className={`h-12 sm:h-14 px-6 sm:px-8 font-semibold tracking-wide text-sm sm:text-base ${className}`}
      style={{ 
        background: 'var(--grad-panic)',
        color: 'var(--bg)',
        border: 'none',
        borderRadius: '24px'
      }}
      data-testid="button-panic"
    >
      <Heart className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 animate-pulse" />
      Need Support?
      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 ml-2 sm:ml-3" />
    </Button>
  );
}