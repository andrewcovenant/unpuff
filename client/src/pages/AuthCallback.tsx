import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the hash fragment from the URL (Supabase uses hash-based tokens for email confirmation)
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const type = hashParams.get("type");

        // Also check for URL search params (some Supabase configurations use query params)
        const searchParams = new URLSearchParams(window.location.search);
        const tokenHash = searchParams.get("token_hash");
        const emailType = searchParams.get("type");

        // Handle email confirmation via token_hash (newer Supabase method)
        if (tokenHash && emailType === "email") {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: "email",
          });

          if (error) {
            console.error("Email verification error:", error);
            setError("Failed to verify email. The link may have expired.");
            return;
          }

          // Email verified successfully - redirect to confirmation page
          setLocation("/email-confirmed");
          return;
        }

        // Handle email confirmation via access_token (legacy or OAuth flow)
        if (accessToken && type === "signup") {
          // Set the session manually if needed
          if (refreshToken) {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
          }

          // Email verified successfully - redirect to confirmation page
          setLocation("/email-confirmed");
          return;
        }

        // Handle other auth callbacks (e.g., OAuth)
        if (accessToken) {
          if (refreshToken) {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
          }
          // OAuth flow - redirect to main app
          setLocation("/");
          return;
        }

        // If no valid tokens found, check if there's already an active session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          setLocation("/");
          return;
        }

        // No tokens and no session - just redirect to auth screen
        setLocation("/");
      } catch (err) {
        console.error("Auth callback error:", err);
        setError("An error occurred during verification.");
      }
    };

    handleEmailConfirmation();
  }, [setLocation]);

  if (error) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 to-slate-900 z-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-xl font-heading font-bold text-white mb-2">
              Verification Failed
            </h1>
            <p className="text-slate-400 mb-6">{error}</p>
            <button
              onClick={() => setLocation("/")}
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Return to Sign In
            </button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-950 to-slate-900 z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md"
      >
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-8 text-center">
          <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Verifying your email...</p>
        </Card>
      </motion.div>
    </div>
  );
}
