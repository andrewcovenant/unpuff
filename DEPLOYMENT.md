# QuitTracker Mobile App - Deployment Guide

## Overview
QuitTracker has been converted to a hybrid mobile app using Capacitor. The web app continues to run on Replit while Capacitor wraps it as a native mobile app for iOS and Android deployment.

## What's Been Implemented

### ✅ Capacitor Integration
- **App ID**: `com.quittracker.app`
- **App Name**: QuitTracker
- **Platforms**: iOS and Android native projects created
- **Build Output**: `dist/public` (configured in Vite)

### ✅ Native Features Integrated
1. **StatusBar** - Matches theme (dark navy or white background)
2. **SplashScreen** - 2-second display with navy background
3. **Keyboard** - Native keyboard handling with accessory bar disabled
4. **Haptics** - Tactile feedback on button interactions:
   - Light haptics: Increment/decrement puff counter
   - Medium haptics: Reset counter
   - Heavy haptics: Panic button

### ✅ Mobile Optimizations
- iOS safe area support (notch and home indicator)
- Dynamic StatusBar style based on light/dark theme
- Proper error handling for all Capacitor plugins
- Mobile-first responsive design maintained

## Prerequisites for App Store Deployment

### For iOS (App Store)
1. **Apple Developer Account** ($99/year)
   - Sign up at: https://developer.apple.com
2. **Mac with Xcode** (latest version)
3. **CocoaPods** installed on Mac
   ```bash
   sudo gem install cocoapods
   ```

### For Android (Google Play Store)
1. **Google Play Console Account** ($25 one-time fee)
   - Sign up at: https://play.google.com/console
2. **Android Studio** (latest version)
3. **Java Development Kit (JDK)** 11 or higher

## Building the Mobile Apps

### Step 1: Prepare the Web App
On Replit, build the latest version:
```bash
npm run build
npx cap sync
```

### Step 2: iOS Build (on Mac)

1. **Open the iOS project:**
   ```bash
   npx cap open ios
   ```
   This opens the project in Xcode.

2. **Configure in Xcode:**
   - Select your development team under "Signing & Capabilities"
   - Update the Bundle Identifier if needed (currently: `com.quittracker.app`)
   - Set the deployment target (iOS 13.0+)

3. **Install iOS dependencies:**
   ```bash
   cd ios/App
   pod install
   ```

4. **Build for Testing:**
   - Select a simulator or connected device
   - Click Run (▶️) in Xcode
   - Test all features (counter, haptics, theme toggle, etc.)

5. **Build for App Store:**
   - Product → Archive
   - Distribute App → App Store Connect
   - Follow Xcode's upload wizard
   - Submit for review in App Store Connect

### Step 3: Android Build

1. **Open the Android project:**
   ```bash
   npx cap open android
   ```
   This opens the project in Android Studio.

2. **Configure in Android Studio:**
   - Update `applicationId` in `android/app/build.gradle` if needed
   - Set version code and version name
   - Configure signing keys (required for Play Store)

3. **Build for Testing:**
   - Run on an emulator or connected device
   - Test all features

4. **Build for Play Store:**
   - Build → Generate Signed Bundle/APK
   - Select "Android App Bundle"
   - Follow the signing wizard
   - Upload the `.aab` file to Google Play Console

## App Icons and Splash Screens

### Generate Icons (Recommended Tool: icon.kitchen)
1. Visit https://icon.kitchen
2. Upload your app icon (1024x1024px recommended)
3. Download the generated assets

### iOS Icons
- Place in: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- Xcode will automatically detect them

### Android Icons
- Place in: `android/app/src/main/res/`
  - `mipmap-hdpi/` (72x72)
  - `mipmap-mdpi/` (48x48)
  - `mipmap-xhdpi/` (96x96)
  - `mipmap-xxhdpi/` (144x144)
  - `mipmap-xxxhdpi/` (192x192)

### Splash Screen
Current config in `capacitor.config.ts`:
```typescript
SplashScreen: {
  launchShowDuration: 2000,
  backgroundColor: "#0B0F14", // Dark navy
  showSpinner: false,
}
```

To customize:
1. Create splash screen images (2732x2732px for iOS, 1920x1920px for Android)
2. Use Capacitor's splash screen generator or manual placement

## Continuous Deployment Workflow

### Development Flow
1. Make changes to the web app on Replit
2. Test in browser at your Replit URL
3. When ready for mobile update:
   ```bash
   npm run build
   npx cap sync
   ```

### For Mobile Updates
- **Over-the-Air (Minor Updates)**: Capacitor supports live updates for web content without App Store resubmission
- **Native Updates (Major Changes)**: If you modify Capacitor config or add plugins, rebuild and resubmit to stores

## Testing Checklist

Before submitting to stores, verify:

### Functionality
- [ ] Puff counter increments/decrements correctly
- [ ] Manual input field works
- [ ] Reset button clears counter
- [ ] Haptic feedback works on all buttons
- [ ] Panic button opens support modal
- [ ] Theme toggle switches light/dark mode
- [ ] StatusBar color matches theme
- [ ] Settings modal saves preferences
- [ ] Achievements display progress
- [ ] History chart shows data

### iOS Specific
- [ ] Safe area insets work (no content under notch)
- [ ] Home indicator area is clear
- [ ] StatusBar style changes with theme
- [ ] Keyboard dismisses properly
- [ ] App works in both portrait and landscape (if supported)

### Android Specific
- [ ] StatusBar color updates with theme
- [ ] Back button navigation works
- [ ] Keyboard behavior is correct
- [ ] App works on various screen sizes

## App Store Metadata

### App Name
QuitTracker

### Short Description (80 chars)
Track your journey to freedom with supportive tools and gamification.

### Long Description
QuitTracker is your compassionate companion on the path to overcoming addiction. With a non-judgmental approach and evidence-based features:

- **Puff Counter**: Track your daily progress with visual feedback
- **Panic Support**: Instant access to calming exercises when you need help
- **Achievements**: Unlock milestones as you progress
- **Progress Analytics**: Visualize your journey with detailed charts
- **Friend Notifications**: Optional support from trusted friends
- **Health Tracking**: Monitor improvements over time
- **Money Saved**: See the financial benefits of your progress

Beautiful design, dark/light themes, and mobile-optimized for your journey.

### Keywords
addiction, quit, tracker, health, wellness, support, recovery, habits

### Category
- iOS: Health & Fitness
- Android: Health & Fitness

### Age Rating
- 17+ (References to addiction/substance use)

## Support & Maintenance

### App Updates
- Web app updates are live immediately on Replit
- Mobile app updates require new builds for native changes
- Use semantic versioning (1.0.0, 1.1.0, etc.)

### Monitoring
- Check Replit logs for web app issues
- Use Xcode Console and Android Logcat for native debugging
- Monitor App Store Connect and Play Console for crash reports

### User Support
- Privacy Policy required for App Store submission
- Terms of Service recommended
- Support email/contact method required

## Next Steps

1. **Test the current build** in browser to ensure web app works perfectly
2. **Get a Mac** (for iOS) or set up Android Studio (for Android)
3. **Create developer accounts** (Apple and/or Google)
4. **Design app icons** (1024x1024px base size)
5. **Open native projects** and configure signing
6. **Build and test** on simulators/emulators
7. **Submit to stores** following platform guidelines

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Android Material Design](https://material.io/design)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://play.google.com/about/developer-content-policy/)

---

**Note**: The Replit web app remains fully functional. This Capacitor integration allows you to deploy the same codebase to mobile app stores while maintaining your web presence.
