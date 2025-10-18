import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import UnpuffApp from "@/components/UnpuffApp";
import CravingRedirect from "@/pages/CravingRedirect";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";
import BottomNav from "@/components/BottomNav";
import PanicModal from "@/components/PanicModal";
import { useEffect, useState } from "react";
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';

function Router() {
  const [location] = useLocation();
  const [isPanicOpen, setIsPanicOpen] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  
  // Check onboarding status on mount and when location changes
  useEffect(() => {
    const checkOnboarding = () => {
      const userData = localStorage.getItem('unpuff-userdata');
      setIsOnboarded(!!userData);
    };
    
    checkOnboarding();
  }, [location]);
  
  // Listen for storage changes (onboarding completion)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'unpuff-userdata' && e.newValue) {
        setIsOnboarded(true);
      }
    };
    
    // Custom event for same-window storage changes
    const handleCustomStorage = () => {
      const userData = localStorage.getItem('unpuff-userdata');
      setIsOnboarded(!!userData);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('onboarding-complete', handleCustomStorage);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('onboarding-complete', handleCustomStorage);
    };
  }, []);
  
  const isOnboarding = location === '/' && !isOnboarded;
  const showBottomNav = !isOnboarding && !isPanicOpen;
  const showPanicModal = isOnboarded; // Only render panic modal component after onboarding

  return (
    <>
      <Switch>
        <Route path="/" component={UnpuffApp} />
        <Route path="/redirect" component={CravingRedirect} />
        <Route path="/profile" component={Profile} />
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>

      {showBottomNav && <BottomNav onPanicClick={() => setIsPanicOpen(true)} />}
      {showPanicModal && <PanicModal isOpen={isPanicOpen} onClose={() => setIsPanicOpen(false)} />}
    </>
  );
}

function App() {
  useEffect(() => {
    const initCapacitor = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#0B0F14' });
        } catch (error) {
          console.error('Capacitor StatusBar initialization failed:', error);
        }

        try {
          await SplashScreen.hide();
        } catch (error) {
          console.error('Capacitor SplashScreen hide failed:', error);
        }

        try {
          await Keyboard.setAccessoryBarVisible({ isVisible: false });
        } catch (error) {
          console.error('Capacitor Keyboard configuration failed:', error);
        }
      }
    };

    initCapacitor();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
