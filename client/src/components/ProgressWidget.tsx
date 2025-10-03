import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, DollarSign, Calendar, Heart } from 'lucide-react';

interface ProgressWidgetProps {
  currentCount: number;
  dailyLimit: number;
  streak: number;
  moneySaved: number;
  costPerUnit: number;
}

export default function ProgressWidget({ 
  currentCount, 
  dailyLimit, 
  streak, 
  moneySaved, 
  costPerUnit 
}: ProgressWidgetProps) {
  const todaySavings = Math.max(0, (dailyLimit - currentCount) * costPerUnit);
  const healthImprovement = Math.max(0, dailyLimit - currentCount);

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {/* Daily Progress */}
      <Card className="hover-elevate">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <span className="hidden sm:inline">Progress Today</span>
            <span className="sm:hidden">Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-foreground">
            {Math.max(0, dailyLimit - currentCount)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            puffs avoided
          </p>
          {currentCount <= dailyLimit && (
            <Badge variant="outline" className="mt-2 text-xs">
              On Track
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Money Saved */}
      <Card className="hover-elevate">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-chart-1" />
            <span className="hidden sm:inline">Saved Today</span>
            <span className="sm:hidden">Saved</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-chart-1">
            ${todaySavings.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total: ${moneySaved.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      {/* Streak */}
      <Card className="hover-elevate">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-chart-3" />
            Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-chart-3">
            {streak}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {streak === 1 ? 'day' : 'days'}
          </p>
        </CardContent>
      </Card>

      {/* Health Impact */}
      <Card className="hover-elevate">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
            <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
            Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-destructive">
            +{healthImprovement}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            health points
          </p>
        </CardContent>
      </Card>
    </div>
  );
}