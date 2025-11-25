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
import AuthCallback from "@/pages/AuthCallback";
import EmailConfirmed from "@/pages/EmailConfirmed";
import { useEffect, useState } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Keyboard } from "@capacitor/keyboard";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp, type URLOpenListenerEvent } from "@capacitor/app";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { useQueryClient } from "@tanstack/react-query";

function Router() {
  const [location, setLocation] = useLocation();
  const [isPanicOpen, setIsPanicOpen] = useState(false);
  const queryClient = useQueryClient();

  // Use React Query hooks for auth and user data
  const { data: user, isLoading: authLoading } = useAuth();
  const { data: userData, isLoading: userDataLoading } = useUserData();

  const isAuthenticated = !!user;
  const isOnboarded = !!userData;

  // Handle deep links on native platforms (e.g., unpuff://auth/callback)
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const handleDeepLink = (event: URLOpenListenerEvent) => {
      // Parse the deep link URL (e.g., unpuff://auth/callback?token_hash=xxx&type=email)
      const url = new URL(event.url);
      const path = url.pathname || url.host + (url.pathname || "");

      // Handle auth callback deep link
      if (path.includes("auth/callback") || url.host === "auth") {
        // Preserve query parameters for the callback handler
        const searchParams = url.search || "";
        const hash = url.hash || "";

        // Navigate to auth callback with the params
        // The AuthCallback component will handle the verification
        window.location.hash = hash;
        window.location.search = searchParams;
        setLocation("/auth/callback");
      }
    };

    CapacitorApp.addListener("appUrlOpen", handleDeepLink);

    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, [setLocation]);

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
      window.removeEventListener(
        "onboarding-complete",
        handleOnboardingComplete
      );
    };
  }, [queryClient]);

  const isOnboarding = location === "/" && !isOnboarded;
  const showBottomNav = !isOnboarding && !isPanicOpen && isAuthenticated;
  const showPanicModal = isOnboarded && isAuthenticated; // Only render panic modal component after onboarding and auth

  // Auth callback and email confirmation routes are accessible without authentication
  const isAuthRoute =
    location === "/auth/callback" || location === "/email-confirmed";

  // Handle auth callback and email confirmation routes first (no auth required)
  if (isAuthRoute) {
    return (
      <Switch>
        <Route path="/auth/callback" component={AuthCallback} />
        <Route path="/email-confirmed" component={EmailConfirmed} />
      </Switch>
    );
  }

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
