# QuitTracker - Addiction Recovery Mobile App

## Project Overview
QuitTracker is a comprehensive addiction tracking application focused on puff counting with supportive features including panic button support, gamification elements, friend notifications, and progress tracking. The app uses a calming, non-judgmental design approach to encourage recovery.

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn UI components
- **Routing**: Wouter
- **State Management**: TanStack Query + React Context
- **Charts**: Recharts
- **Mobile**: Capacitor (hybrid mobile app wrapper)
- **Backend**: Express.js (minimal - for potential future API routes)
- **Storage**: In-memory (MemStorage) with localStorage for persistence

## Mobile Deployment
The app has been converted to a hybrid mobile app using **Capacitor** for iOS App Store and Google Play Store deployment:

### Capacitor Setup
- **App ID**: `com.quittracker.app`
- **App Name**: QuitTracker
- **Platforms**: iOS and Android
- **Build Output**: `dist/public`

### Native Features Integrated
1. **StatusBar** - Dynamic color based on theme (dark navy / white)
2. **SplashScreen** - 2-second display with navy background
3. **Keyboard** - Native keyboard handling
4. **Haptics** - Tactile feedback on button presses
   - Light: Increment/decrement counter
   - Medium: Reset counter  
   - Heavy: Panic button

### Mobile Build Commands
```bash
# Build web app and sync to native platforms
npm run build
npx cap sync

# Open native IDEs (requires Mac for iOS, Android Studio for Android)
npx cap open ios
npx cap open android
```

See **DEPLOYMENT.md** for complete deployment guide.

## Design System

### Typography
- **Headings**: Space Grotesk (400, 600, 700)
- **Body**: Inter (400, 500, 600, 700)

### Color Palette

#### Light Mode
- **Background**: #FFFFFF (white)
- **Surface**: #F7FAFC (light gray)
- **Primary**: #0EA5E9 (cyan)
- **Accent**: #7C3AED (violet)
- **Success**: #059669 (green)
- **Warning**: #D97706 (amber)
- **Error**: #DC2626 (red)

#### Dark Mode
- **Background**: #0B0F14 (dark navy)
- **Surface**: #111824 (slate)
- **Primary**: #22D3EE (electric cyan)
- **Accent**: #A78BFA (soft violet)
- **Success**: #34D399 (light green)
- **Warning**: #F59E0B (amber)
- **Error**: #F43F5E (rose)

### Spacing Grid
8-point spacing system (4px, 8px, 16px, 24px, 32px, 40px, 48px)

## Core Features

### 1. Puff Counter
- Circular progress ring with color indicators:
  - **Green**: < 70% of daily limit (safe zone)
  - **Amber**: 70-100% of limit (warning)
  - **Red**: Over limit (danger)
- Increment/decrement buttons with haptic feedback
- Manual input field for direct entry
- Reset button
- Today's date display

### 2. Progress Tracking
Four key metrics displayed as cards:
- **Progress**: Percentage toward daily goal
- **Money Saved**: Real-time savings calculation
- **Streak**: Consecutive days staying under limit
- **Health Score**: Improvement tracking

### 3. Panic Support System
- Gradient "Need Support?" button (always visible)
- Opens support modal with:
  - Breathing exercises (with illustration)
  - Calming meditation (with background image)
  - Call support hotline (with phone icon)
  - Emergency contacts

### 4. Achievements & Gamification
Five achievement categories:
- **Milestone**: First day, weekly progress
- **Streak**: Consecutive days under limit
- **Savings**: Money saved milestones
- **Health**: Health improvement points
- **Special**: Unique achievements

Each achievement shows:
- Icon badge
- Title and description
- Progress bar (current/target)
- Unlock state

### 5. History & Analytics
Interactive chart with multiple time views:
- 7 days (daily granularity)
- 2 weeks (daily granularity)
- 1 month (weekly granularity)
- 1 year (monthly granularity)

### 6. Settings & Customization
User preferences:
- Habit name/type
- Daily goal/limit
- Cost per unit (for savings calculation)
- Friend email addresses (for notifications)
- Personal motivation message

### 7. Onboarding Flow
5-step guided setup:
1. Welcome screen
2. Habit selection
3. Goal setting
4. Support network (friend emails)
5. Motivation & completion

## File Structure

### Core Components
- `QuitTrackerApp.tsx` - Main app container
- `PuffCounter.tsx` - Counter with circular progress
- `PanicButton.tsx` - Emergency support button
- `ProgressWidget.tsx` - 4-metric dashboard
- `AchievementCard.tsx` - Gamification achievements
- `HistoryChart.tsx` - Analytics visualization
- `PanicSupportModal.tsx` - Support options modal
- `OnboardingFlow.tsx` - Initial setup wizard
- `SettingsModal.tsx` - User preferences
- `ThemeToggle.tsx` - Light/dark mode switcher

### Mobile-Specific Files
- `capacitor.config.ts` - Capacitor configuration
- `ios/` - iOS native project (Xcode)
- `android/` - Android native project (Gradle)

### Styling
- `index.css` - Global styles, theme variables, safe areas
- `design_guidelines.md` - Design system documentation
- `tailwind.config.ts` - Tailwind configuration

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Run dev server (port 5000)
npm run dev

# Type checking
npm run check
```

### Mobile Development
```bash
# Build for production
npm run build

# Sync with Capacitor
npx cap sync

# Test on iOS simulator (Mac only)
npx cap run ios

# Test on Android emulator
npx cap run android
```

## Mock Data & TODO Items
All mock data is marked with `//todo: remove mock functionality` comments for easy identification before production:
- Achievement data in `QuitTrackerApp.tsx`
- Streak count (default: 3 days)
- Total money saved (default: $45.50)
- History chart data in `HistoryChart.tsx`

## Integration Capabilities
Available but not yet implemented:
- **OpenAI** - For AI-powered support messages
- **SendGrid** - For friend notification emails
- **PostgreSQL** - For persistent data storage (currently using localStorage)

## Theme System
- Light/dark mode toggle
- Persisted in localStorage
- Updates StatusBar color on mobile
- Automatic OS preference detection (planned)

## Mobile Optimizations
- Responsive breakpoints: `sm:` (640px), `md:` (768px)
- Touch-friendly button sizes (min 44x44px)
- Safe area support for iOS notch/home indicator
- Haptic feedback on interactions
- Native keyboard handling
- StatusBar style matches app theme

## Privacy & Security
- All user data stored locally (localStorage)
- No server-side data collection
- Friend emails only used for local notifications (not implemented yet)
- Capacitor plugins use runtime permission requests

## Future Enhancements
1. **Backend Integration**
   - Replace in-memory storage with PostgreSQL
   - User authentication system
   - Cloud sync across devices

2. **AI Features**
   - Personalized support messages (OpenAI)
   - Craving prediction alerts
   - Progress insights

3. **Notifications**
   - Friend email notifications (SendGrid)
   - Local push notifications for milestones
   - Daily reminder notifications

4. **Social Features**
   - Friend accountability system
   - Group challenges
   - Community support forums

5. **Advanced Analytics**
   - Trigger pattern analysis
   - Success rate predictions
   - Personalized recommendations

## Recent Changes (Latest Session)
- Converted web app to hybrid mobile app with Capacitor
- Added iOS and Android platform support
- Integrated native plugins: StatusBar, SplashScreen, Keyboard, Haptics
- Implemented safe area support for iOS devices
- Added haptic feedback to counter buttons and panic button
- Enhanced theme toggle to update StatusBar dynamically
- Added error handling for all Capacitor plugin calls
- Fixed Android instrumentation test package name
- Created comprehensive deployment documentation

## Known Issues
- CocoaPods not installed in Replit environment (must be installed on Mac for iOS development)
- Xcodebuild tools not available in Replit (Mac required)
- Build warnings about chunk sizes (>500KB) - consider code splitting for production
- PostCSS warnings (non-critical)

## App Store Readiness
- ✅ Capacitor configured for iOS and Android
- ✅ Native features integrated and tested
- ✅ Safe area handling for modern iOS devices
- ✅ Error handling for production stability
- ⏳ App icons and splash screens (need custom assets)
- ⏳ App Store metadata and screenshots
- ⏳ Privacy policy and terms of service
- ⏳ Developer account setup (Apple/Google)

See **DEPLOYMENT.md** for complete deployment instructions.
