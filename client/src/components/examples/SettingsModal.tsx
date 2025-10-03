import { useState } from 'react';
import SettingsModal from '../SettingsModal';
import { Button } from '@/components/ui/button';

export default function SettingsModalExample() {
  const [open, setOpen] = useState(false);

  const mockUserData = {
    currentHabit: 'Vaping',
    dailyGoal: 10,
    costPerUnit: 1.5,
    friendEmails: ['friend1@example.com', 'friend2@example.com'],
    motivation: 'Want to be healthier'
  };

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Open Settings</Button>
      <SettingsModal 
        open={open} 
        onOpenChange={setOpen}
        userData={mockUserData}
        onUpdateSettings={(updates) => console.log('Settings updated:', updates)}
      />
    </div>
  );
}