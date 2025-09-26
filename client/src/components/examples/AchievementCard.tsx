import AchievementCard, { Achievement } from '../AchievementCard';

// todo: remove mock functionality
const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Log your first day of tracking',
    icon: '🎯',
    unlocked: true,
    progress: 1,
    target: 1,
    category: 'milestone'
  },
  {
    id: '2', 
    title: 'Week Warrior',
    description: 'Stay on track for 7 consecutive days',
    icon: '⭐',
    unlocked: false,
    progress: 3,
    target: 7,
    category: 'streak'
  },
  {
    id: '3',
    title: 'Money Saver',
    description: 'Save your first $25',
    icon: '💰',
    unlocked: false,
    progress: 15.75,
    target: 25,
    category: 'savings'
  }
];

export default function AchievementCardExample() {
  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {mockAchievements.map(achievement => (
        <AchievementCard key={achievement.id} achievement={achievement} />
      ))}
    </div>
  );
}