import { Button } from '@/components/ui/button';
import { AlertCircle, Heart } from 'lucide-react';

interface PanicButtonProps {
  onClick?: () => void;
  className?: string;
}

export default function PanicButton({ onClick, className = "" }: PanicButtonProps) {
  const handleClick = () => {
    console.log('Panic button activated - opening support modal');
    onClick?.();
  };

  return (
    <Button
      onClick={handleClick}
      size="lg"
      className={`bg-chart-2 hover:bg-chart-2/90 text-white border-0 shadow-lg h-12 sm:h-14 px-6 sm:px-8 font-semibold tracking-wide text-sm sm:text-base ${className}`}
      data-testid="button-panic"
    >
      <Heart className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 animate-pulse" />
      Need Support?
      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 ml-2 sm:ml-3" />
    </Button>
  );
}