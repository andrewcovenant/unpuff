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
import AuthScreen from "@/components/AuthScreen";
import { useEffect, useState } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Keyboard } from "@capacitor/keyboard";
import { Capacitor } from "@capacitor/core";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { useQueryClient } from "@tanstack/react-query";

function Router() {
  const [location] = useLocation();
  const [isPanicOpen, setIsPanicOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Use React Query hooks for auth and user data
  const { data: user, isLoading: authLoading } = useAuth();
  const { data: userData, isLoading: userDataLoading } = useUserData();

  const isAuthenticated = !!user;
  const isOnboarded = !!userData;

  // Listen for auth completion events (for backward compatibility)
  useEffect(() => {
    const handleAuthComplete = () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    };

    window.addEventListener("auth-complete", handleAuthComplete);

    return () => {
      window.removeEventListener("auth-complete", handleAuthComplete);
    };
  }, [queryClient]);

  // Listen for onboarding completion events (for backward compatibility)
  useEffect(() => {
    const handleOnboardingComplete = () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    };

    window.addEventListener("onboarding-complete", handleOnboardingComplete);

    return () => {
      window.removeEventListener("onboarding-complete", handleOnboardingComplete);
    };
  }, [queryClient]);

  const isOnboarding = location === "/" && !isOnboarded;
  const showBottomNav = !isOnboarding && !isPanicOpen && isAuthenticated;
  const showPanicModal = isOnboarded && isAuthenticated; // Only render panic modal component after onboarding and auth

  // Show loading state while checking auth
  if (authLoading || userDataLoading) {
    return null; // Or a loading spinner
  }

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return (
      <AuthScreen
        onAuthSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["auth"] });
        }}
      />
    );
  }

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
      {showPanicModal && (
        <PanicModal
          isOpen={isPanicOpen}
          onClose={() => setIsPanicOpen(false)}
        />
      )}
    </>
  );
}

function App() {
  useEffect(() => {
    const initCapacitor = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: "#0B0F14" });
        } catch (error) {
          console.error("Capacitor StatusBar initialization failed:", error);
        }

        try {
          await SplashScreen.hide();
        } catch (error) {
          console.error("Capacitor SplashScreen hide failed:", error);
        }

        try {
          await Keyboard.setAccessoryBarVisible({ isVisible: false });
        } catch (error) {
          console.error("Capacitor Keyboard configuration failed:", error);
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
