import { useState, useEffect } from 'react';
import PuffCounter from './PuffCounter';
import ProgressWidget from './ProgressWidget';
import AchievementCard, { Achievement } from './AchievementCard';
import OnboardingFlow from './OnboardingFlow';
import SettingsModal from './SettingsModal';
import HistoryChart from './HistoryChart';
import { ThemeToggle } from './ThemeToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Trophy, BarChart3, Heart, Target } from 'lucide-react';
import achievementBadges from '@assets/generated_images/Achievement_badge_icons_set_a2728ae6.png';

interface UserData {
  identity: string;
  triggers: string[];
  dailyBaseline: number;
  dailyGoal: number;
}

export default function UnpuffApp() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
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
    const savedUserData = localStorage.getItem('unpuff-userdata');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
      setIsOnboarded(true);
    }
  }, []);

  const handleOnboardingComplete = (data: UserData) => {
    setUserData(data);
    setIsOnboarded(true);
    localStorage.setItem('unpuff-userdata', JSON.stringify(data));
    console.log('User onboarding completed:', data);
    // Dispatch custom event to notify Router component
    window.dispatchEvent(new Event('onboarding-complete'));
  };

  const handleUpdateSettings = (updates: Partial<UserData>) => {
    if (userData) {
      const updatedData = { ...userData, ...updates };
      setUserData(updatedData);
      localStorage.setItem('unpuff-userdata', JSON.stringify(updatedData));
      console.log('Settings updated:', updatedData);
    }
  };

  const handlePuffCountChange = (count: number) => {
    setPuffCount(count);
    
    // Log when user exceeds their goal
    if (userData && count > userData.dailyGoal) {
      console.log('User exceeded their daily goal');
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

  const todaysSaved = userData ? Math.max(0, userData.dailyGoal - puffCount) : 0;
  const isOverLimit = userData ? puffCount > userData.dailyGoal : false;

  return (
    <div className="min-h-screen bg-background" style={{ 
      paddingTop: 'var(--safe-area-inset-top)',
      paddingBottom: 'var(--safe-area-inset-bottom)'
    }}>
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="w-full px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-heading font-bold text-foreground truncate">Unpuff</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Take back control</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
              <Badge variant="outline" className="text-xs px-2">
                Day {streak}
              </Badge>
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSettingsModal(true)}
                data-testid="button-settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="space-y-1 sm:space-y-2">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground px-2">
              Mission: Stay under {userData?.dailyGoal || 10} puffs today
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              I am someone who {userData?.identity || "is taking control"}
            </p>
          </div>
        </div>

        {/* Main Counter */}
        <div className="w-full max-w-md mx-auto">
          <PuffCounter
            dailyLimit={userData?.dailyGoal || 10}
            onCountChange={handlePuffCountChange}
          />
        </div>

        {/* Alert for over limit */}
        {isOverLimit && (
          <Card className="w-full max-w-md mx-auto bg-destructive/5 border-destructive/20">
            <CardContent className="p-3 sm:p-4 text-center">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-destructive mx-auto mb-2" />
              <p className="text-sm font-medium text-destructive">
                You've exceeded your daily goal
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Take a breath - you've got this
              </p>
            </CardContent>
          </Card>
        )}

        {/* Tabs for different sections */}
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="progress" data-testid="tab-progress" className="text-xs sm:text-sm">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" data-testid="tab-achievements" className="text-xs sm:text-sm">
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Achievements</span>
            </TabsTrigger>
            <TabsTrigger value="insights" data-testid="tab-insights" className="text-xs sm:text-sm">
              <Target className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="mt-6 space-y-4 sm:space-y-6">
            <ProgressWidget
              currentCount={puffCount}
              dailyLimit={userData?.dailyGoal || 10}
              streak={streak}
              moneySaved={totalMoneySaved}
              costPerUnit={1.0}
            />
            
            <HistoryChart dailyLimit={userData?.dailyGoal || 10} />
          </TabsContent>

          <TabsContent value="achievements" className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            <div className="text-center mb-4 sm:mb-6">
              <img 
                src={achievementBadges} 
                alt="Achievement badges"
                className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-lg object-contain bg-card p-3 sm:p-4"
              />
              <h3 className="font-heading font-semibold text-base sm:text-lg mt-3 sm:mt-4">Your Achievements</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {achievements.filter(a => a.unlocked).length} of {achievements.length} unlocked
              </p>
            </div>
            
            <div className="grid gap-2 sm:gap-3">
              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="mt-4 sm:mt-6">
            <div className="grid gap-3 sm:gap-4">
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg font-heading">Today's Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-chart-1">
                        {todaysSaved}
                      </div>
                      <p className="text-xs text-muted-foreground">Puffs saved today</p>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-chart-2">
                        {Math.round((todaysSaved / (userData?.dailyBaseline || 15)) * 100)}%
                      </div>
                      <p className="text-xs text-muted-foreground">Reduction from baseline</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg font-heading">Your Triggers</CardTitle>
                </CardHeader>
                <CardContent>
                  {userData?.triggers && userData.triggers.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {userData.triggers.map((trigger) => (
                        <Badge key={trigger} variant="outline" className="text-xs">
                          {trigger}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No triggers identified yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Settings Modal - temporarily disabled until we update it */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Settings panel coming soon
              </p>
              <Button onClick={() => setShowSettingsModal(false)} data-testid="button-close-settings">
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}