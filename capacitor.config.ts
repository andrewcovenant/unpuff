import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quittracker.app',
  appName: 'QuitTracker',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
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
      style: 'dark',
      backgroundColor: "#0B0F14"
    },
    Keyboard: {
      resize: 'native'
    }
  }
};

export default config;
