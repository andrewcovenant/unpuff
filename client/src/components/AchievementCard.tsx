import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Lock } from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
  category: 'milestone' | 'streak' | 'savings' | 'health';
}

interface AchievementCardProps {
  achievement: Achievement;
}

const categoryColors = {
  milestone: 'text-chart-1',
  streak: 'text-chart-3',
  savings: 'text-primary',
  health: 'text-destructive'
};

export default function AchievementCard({ achievement }: AchievementCardProps) {
  const progressPercentage = Math.min((achievement.progress / achievement.target) * 100, 100);
  const colorClass = categoryColors[achievement.category];

  return (
    <Card className={`hover-elevate transition-all duration-200 ${achievement.unlocked ? 'border-primary/40 bg-primary/5' : 'border-border'}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon/Status */}
          <div className="flex-shrink-0">
            {achievement.unlocked ? (
              <div className={`w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center ${colorClass}`}>
                <CheckCircle className="h-6 w-6" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <Lock className="h-6 w-6" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className={`font-semibold text-sm ${achievement.unlocked ? colorClass : 'text-muted-foreground'}`}>
                  {achievement.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {achievement.description}
                </p>
              </div>
              {achievement.unlocked && (
                <Badge variant="outline" className="text-xs">
                  Unlocked
                </Badge>
              )}
            </div>

            {/* Progress Bar */}
            {!achievement.unlocked && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>{achievement.progress}/{achievement.target}</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 bg-gradient-to-r from-primary to-chart-1`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}