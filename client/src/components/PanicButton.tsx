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
      className={`bg-chart-2 hover:bg-chart-2/90 text-white border-0 shadow-lg h-14 px-8 font-semibold tracking-wide ${className}`}
      data-testid="button-panic"
    >
      <Heart className="h-6 w-6 mr-3 animate-pulse" />
      Need Support?
      <AlertCircle className="h-5 w-5 ml-3" />
    </Button>
  );
}