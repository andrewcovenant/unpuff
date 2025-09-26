import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Target, DollarSign, Users, Calendar } from 'lucide-react';

interface OnboardingData {
  currentHabit: string;
  dailyGoal: number;
  costPerUnit: number;
  friendEmails: string[];
  motivation: string;
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  onClose: () => void;
}

export default function OnboardingFlow({ onComplete, onClose }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    currentHabit: '',
    dailyGoal: 10,
    costPerUnit: 1.0,
    friendEmails: [],
    motivation: ''
  });
  const [friendEmail, setFriendEmail] = useState('');

  const steps = [
    {
      id: 'habit',
      title: 'What are you tracking?',
      subtitle: 'Help us understand your goal',
      icon: Target
    },
    {
      id: 'goals',
      title: 'Set your targets',
      subtitle: 'Define realistic daily limits',
      icon: Calendar
    },
    {
      id: 'cost',
      title: 'Track your savings',
      subtitle: 'See the financial impact',
      icon: DollarSign
    },
    {
      id: 'support',
      title: 'Build your support network',
      subtitle: 'Friends who can help you stay accountable',
      icon: Users
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const addFriend = () => {
    if (friendEmail && !data.friendEmails.includes(friendEmail)) {
      setData(prev => ({
        ...prev,
        friendEmails: [...prev.friendEmails, friendEmail]
      }));
      setFriendEmail('');
      console.log('Added friend email:', friendEmail);
    }
  };

  const removeFriend = (email: string) => {
    setData(prev => ({
      ...prev,
      friendEmails: prev.friendEmails.filter(e => e !== email)
    }));
    console.log('Removed friend email:', email);
  };

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-heading">{currentStep.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">{currentStep.subtitle}</p>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex gap-2 justify-center">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step Content */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="habit">What habit are you tracking?</Label>
                <Input
                  id="habit"
                  placeholder="e.g., Cigarettes, vaping, social media..."
                  value={data.currentHabit}
                  onChange={(e) => setData(prev => ({ ...prev, currentHabit: e.target.value }))}
                  data-testid="input-habit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivation">What motivates you to change?</Label>
                <Textarea
                  id="motivation"
                  placeholder="Share your why..."
                  value={data.motivation}
                  onChange={(e) => setData(prev => ({ ...prev, motivation: e.target.value }))}
                  data-testid="input-motivation"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dailyGoal">Daily limit (number you want to stay under)</Label>
                <Input
                  id="dailyGoal"
                  type="number"
                  min="1"
                  max="100"
                  value={data.dailyGoal}
                  onChange={(e) => setData(prev => ({ ...prev, dailyGoal: parseInt(e.target.value) || 10 }))}
                  data-testid="input-daily-goal"
                />
                <p className="text-xs text-muted-foreground">
                  Start with a realistic goal you can achieve
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="costPerUnit">Cost per unit ($)</Label>
                <Input
                  id="costPerUnit"
                  type="number"
                  min="0"
                  step="0.01"
                  value={data.costPerUnit}
                  onChange={(e) => setData(prev => ({ ...prev, costPerUnit: parseFloat(e.target.value) || 1.0 }))}
                  data-testid="input-cost-per-unit"
                />
                <p className="text-xs text-muted-foreground">
                  We'll calculate how much money you're saving
                </p>
              </div>
              
              {/* Savings Preview */}
              <Card className="bg-chart-1/5 border-chart-1/20">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">If you avoid {data.dailyGoal} per day</p>
                    <div className="text-2xl font-bold text-chart-1 mt-1">
                      ${(data.dailyGoal * data.costPerUnit * 30).toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">saved per month</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Support network (optional)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="friend@example.com"
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                    data-testid="input-friend-email"
                  />
                  <Button 
                    onClick={addFriend}
                    disabled={!friendEmail}
                    data-testid="button-add-friend"
                  >
                    Add
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Friends will be notified if you exceed your daily limit
                </p>
              </div>

              {data.friendEmails.length > 0 && (
                <div className="space-y-2">
                  <Label>Your support network</Label>
                  <div className="flex flex-wrap gap-2">
                    {data.friendEmails.map((email) => (
                      <Badge
                        key={email}
                        variant="outline"
                        className="cursor-pointer hover:bg-destructive/10 hover:border-destructive/20"
                        onClick={() => removeFriend(email)}
                        data-testid={`badge-friend-${email}`}
                      >
                        {email} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={step === 0 ? onClose : handleBack}
              data-testid="button-back"
            >
              {step === 0 ? 'Cancel' : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </>
              )}
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={step === 0 && !data.currentHabit}
              data-testid="button-next"
            >
              {step === steps.length - 1 ? 'Start Tracking' : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}