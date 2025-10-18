import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import UnpuffApp from "@/components/UnpuffApp";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';

function Router() {
  return (
    <Switch>
      <Route path="/" component={UnpuffApp} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
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
