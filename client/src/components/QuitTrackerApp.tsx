import { useState, useEffect } from 'react';
import PuffCounter from './PuffCounter';
import PanicButton from './PanicButton';
import ProgressWidget from './ProgressWidget';
import AchievementCard, { Achievement } from './AchievementCard';
import PanicSupportModal from './PanicSupportModal';
import OnboardingFlow from './OnboardingFlow';
import { ThemeToggle } from './ThemeToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Trophy, BarChart3, Heart, Target } from 'lucide-react';
import achievementBadges from '@assets/generated_images/Achievement_badge_icons_set_a2728ae6.png';

interface UserData {
  currentHabit: string;
  dailyGoal: number;
  costPerUnit: number;
  friendEmails: string[];
  motivation: string;
}

export default function QuitTrackerApp() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [showPanicModal, setShowPanicModal] = useState(false);
  const [puffCount, setPuffCount] = useState(0);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [streak, setStreak] = useState(3); // todo: remove mock functionality
  const [totalMoneySaved] = useState(45.50); // todo: remove mock functionality

  // todo: remove mock functionality
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Day',
      description: 'Successfully tracked your first day',
      icon: '🎯',
      unlocked: true,
      progress: 1,
      target: 1,
      category: 'milestone'
    },
    {
      id: '2',
      title: 'Three Day Hero',
      description: 'Stayed under your limit for 3 days',
      icon: '⭐',
      unlocked: true,
      progress: 3,
      target: 3,
      category: 'streak'
    },
    {
      id: '3',
      title: 'Week Warrior',
      description: 'One full week of progress',
      icon: '🏆',
      unlocked: false,
      progress: 3,
      target: 7,
      category: 'streak'
    },
    {
      id: '4',
      title: 'Money Saver',
      description: 'Saved your first $50',
      icon: '💰',
      unlocked: false,
      progress: 45.50,
      target: 50,
      category: 'savings'
    },
    {
      id: '5',
      title: 'Health Improver',
      description: 'Improved your health score by 25 points',
      icon: '❤️',
      unlocked: false,
      progress: 18,
      target: 25,
      category: 'health'
    }
  ];

  useEffect(() => {
    // Check if user has completed onboarding
    const savedUserData = localStorage.getItem('quittracker-userdata');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
      setIsOnboarded(true);
    }
  }, []);

  const handleOnboardingComplete = (data: UserData) => {
    setUserData(data);
    setIsOnboarded(true);
    localStorage.setItem('quittracker-userdata', JSON.stringify(data));
    console.log('User onboarding completed:', data);
  };

  const handlePuffCountChange = (count: number) => {
    setPuffCount(count);
    
    // Send notification if over limit
    if (userData && count > userData.dailyGoal && userData.friendEmails.length > 0) {
      console.log('User exceeded limit, would notify friends:', userData.friendEmails);
      // In a real app, this would trigger email notifications
    }
  };

  if (!isOnboarded) {
    return (
      <OnboardingFlow
        onComplete={handleOnboardingComplete}
        onClose={() => console.log('Onboarding cancelled')}
      />
    );
  }

  const todaySavings = userData ? Math.max(0, (userData.dailyGoal - puffCount) * userData.costPerUnit) : 0;
  const isOverLimit = userData ? puffCount > userData.dailyGoal : false;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-foreground">QuitTracker</h1>
                <p className="text-xs text-muted-foreground">Your journey to freedom</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">
                Day {streak}
              </Badge>
              <ThemeToggle />
              <Button variant="ghost" size="icon" data-testid="button-settings">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-heading font-bold text-foreground">
              {userData?.motivation || "You're doing great!"}
            </h2>
            <p className="text-muted-foreground">
              Tracking: {userData?.currentHabit || "Your habit"}
            </p>
          </div>

          {/* Panic Button - Always visible */}
          <div className="flex justify-center">
            <PanicButton onClick={() => setShowPanicModal(true)} />
          </div>
        </div>

        {/* Main Counter */}
        <div className="max-w-md mx-auto">
          <PuffCounter
            dailyLimit={userData?.dailyGoal || 10}
            onCountChange={handlePuffCountChange}
          />
        </div>

        {/* Alert for over limit */}
        {isOverLimit && userData?.friendEmails && userData.friendEmails.length > 0 && (
          <Card className="max-w-md mx-auto bg-destructive/5 border-destructive/20">
            <CardContent className="p-4 text-center">
              <Heart className="h-6 w-6 text-destructive mx-auto mb-2" />
              <p className="text-sm font-medium text-destructive">
                Limit exceeded - your support network has been notified
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {userData.friendEmails.length} {userData.friendEmails.length === 1 ? 'friend' : 'friends'} alerted
              </p>
            </CardContent>
          </Card>
        )}

        {/* Tabs for different sections */}
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="progress" data-testid="tab-progress">
              <BarChart3 className="h-4 w-4 mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="achievements" data-testid="tab-achievements">
              <Trophy className="h-4 w-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="insights" data-testid="tab-insights">
              <Target className="h-4 w-4 mr-2" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="mt-6">
            <ProgressWidget
              currentCount={puffCount}
              dailyLimit={userData?.dailyGoal || 10}
              streak={streak}
              moneySaved={totalMoneySaved}
              costPerUnit={userData?.costPerUnit || 1.0}
            />
          </TabsContent>

          <TabsContent value="achievements" className="mt-6 space-y-4">
            <div className="text-center mb-6">
              <img 
                src={achievementBadges} 
                alt="Achievement badges"
                className="w-32 h-32 mx-auto rounded-lg object-contain bg-card p-4"
              />
              <h3 className="font-heading font-semibold text-lg mt-4">Your Achievements</h3>
              <p className="text-sm text-muted-foreground">
                {achievements.filter(a => a.unlocked).length} of {achievements.length} unlocked
              </p>
            </div>
            
            <div className="grid gap-3">
              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heading">Today's Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-chart-1">
                        ${todaySavings.toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground">Saved today</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-chart-2">
                        +{Math.max(0, (userData?.dailyGoal || 10) - puffCount)}
                      </div>
                      <p className="text-xs text-muted-foreground">Health points</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heading">Your Network</CardTitle>
                </CardHeader>
                <CardContent>
                  {userData?.friendEmails && userData.friendEmails.length > 0 ? (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {userData.friendEmails.length} {userData.friendEmails.length === 1 ? 'friend' : 'friends'} supporting you
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {userData.friendEmails.map((email) => (
                          <Badge key={email} variant="outline" className="text-xs">
                            {email.split('@')[0]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No support network set up yet. Consider adding friends for accountability.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Support Modal */}
      <PanicSupportModal
        open={showPanicModal}
        onOpenChange={setShowPanicModal}
      />
    </div>
  );
}