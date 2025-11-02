import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.unpuff.app",
  appName: "Unpuff",
  webDir: "dist/public",
  server: {
    androidScheme: "https",
    // Enable live reload in development
    // When running npm run dev, uncomment the url below:
    // url: 'http://localhost:5000',
    // For production builds, this should be commented out or removed
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0B0F14",
      showSpinner: false,
      androidSpinnerStyle: "small",
      iosSpinnerStyle: "small",
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#0B0F14",
    },
    Keyboard: {
      resize: "native",
    },
  },
};

export default config;
