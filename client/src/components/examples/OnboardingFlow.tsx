import { useState } from 'react';
import OnboardingFlow from '../OnboardingFlow';
import { Button } from '@/components/ui/button';

export default function OnboardingFlowExample() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setShowOnboarding(true)}>Start Onboarding</Button>
      
      {showOnboarding && (
        <OnboardingFlow
          onComplete={(data) => {
            console.log('Onboarding completed:', data);
            setShowOnboarding(false);
          }}
          onClose={() => setShowOnboarding(false)}
        />
      )}
    </div>
  );
}