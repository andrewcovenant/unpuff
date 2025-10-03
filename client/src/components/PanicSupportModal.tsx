import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Phone, Gamepad2, Users, BookOpen, Wind, Heart } from 'lucide-react';
import breathingImage from '@assets/generated_images/Breathing_exercise_illustration_a49ad336.png';
import mindfulnessImage from '@assets/generated_images/Calming_mindfulness_background_image_3bac6002.png';

interface PanicSupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PanicSupportModal({ open, onOpenChange }: PanicSupportModalProps) {
  const supportOptions = [
    {
      id: 'ai-chat',
      title: 'Chat with AI Support',
      description: 'Get personalized encouragement and coping strategies',
      icon: MessageCircle,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
      action: () => console.log('Opening AI chat support')
    },
    {
      id: 'call-friend',
      title: 'Call a Friend',
      description: 'Reach out to your trusted contacts',
      icon: Phone,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
      action: () => console.log('Opening friend contacts')
    },
    {
      id: 'dopamine-rush',
      title: 'Quick Dopamine Activities',
      description: 'Healthy alternatives for instant satisfaction',
      icon: Gamepad2,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
      action: () => console.log('Opening dopamine activities')
    },
    {
      id: 'community',
      title: 'Community Support',
      description: 'Connect with others on the same journey',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      action: () => console.log('Opening community chat')
    },
    {
      id: 'blog',
      title: 'Recovery Resources',
      description: 'Read about benefits and success stories',
      icon: BookOpen,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
      action: () => console.log('Opening blog resources')
    },
    {
      id: 'breathing',
      title: 'Breathing Exercises',
      description: 'Calm your mind with guided breathing',
      icon: Wind,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
      action: () => console.log('Starting breathing exercise')
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-chart-2/20 flex items-center justify-center">
              <Heart className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <DialogTitle className="text-xl font-heading">You're Not Alone</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Choose the support that feels right for you
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Quick Inspiration */}
        <Card className="bg-gradient-to-r from-primary/5 to-chart-1/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <img 
                src={mindfulnessImage} 
                alt="Calming nature scene"
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <p className="text-sm font-medium text-foreground">
                  "Every moment is a fresh beginning."
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  You've got this. Take it one breath at a time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {supportOptions.map((option) => (
            <Card 
              key={option.id}
              className="hover-elevate cursor-pointer transition-all duration-200"
              onClick={option.action}
              data-testid={`support-option-${option.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg ${option.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <option.icon className={`h-5 w-5 ${option.color}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-foreground leading-tight">
                      {option.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {option.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Breathing Exercise Preview */}
        <Card className="bg-gradient-to-br from-chart-2/10 to-chart-2/5 border-chart-2/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <img 
                src={breathingImage} 
                alt="Breathing exercise guide"
                className="w-20 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-sm text-foreground">Quick Calm</h3>
                  <Badge variant="outline" className="text-xs">4-7-8 Method</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Breathe in for 4, hold for 7, exhale for 8. Repeat 4 times.
                </p>
                <Button 
                  size="sm" 
                  className="mt-2"
                  onClick={() => console.log('Starting breathing exercise')}
                  data-testid="button-start-breathing"
                >
                  <Wind className="h-3 w-3 mr-1" />
                  Start Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            In crisis? Call{' '}
            <Button 
              variant="ghost" 
              className="text-xs h-auto p-0 text-destructive hover:text-destructive"
              onClick={() => console.log('Opening crisis hotline')}
            >
              Crisis Hotline: 988
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}