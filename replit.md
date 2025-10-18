# Unpuff - Identity-Driven Addiction Recovery Mobile App

## Overview
Unpuff is an empowering, identity-driven addiction tracking mobile application focused on puff counting. Its core purpose is to provide a revolutionary approach to recovery through personalized progress tracking, panic support, and craving redirect activities. The project aims to deliver a seamless user experience across iOS, Android, and web platforms, with a focus on empowering users to take control of their addiction.

## User Preferences
I prefer an iterative development approach, where changes are made incrementally, and I am consulted before any major architectural or design decisions are implemented. I value clear and concise communication, avoiding overly technical jargon when possible. Please ensure all code changes are thoroughly tested and documented. I prefer detailed explanations for complex features and design choices.

## System Architecture

### UI/UX Decisions
- **Onboarding**: A cinematic 3-screen flow (under 45 seconds) focusing on identity validation, trigger identification, and personalized goal setting.
- **Navigation**: Static bottom navigation with three distinct buttons: Craving Redirect, Panic, and Profile. The Panic button is visually prominent.
- **Theming**: Light and Dark mode support with a predefined color palette, typography (Space Grotesk for headings, Inter for body), and an 8-point spacing system.
- **Haptic Feedback**: Integrated tactile feedback for key interactions across mobile and web platforms.

### Technical Implementations
- **Frontend**: React 18 with TypeScript and Vite.
- **Styling**: Tailwind CSS and Shadcn UI components for a modern, responsive design.
- **Routing**: Wouter for client-side navigation.
- **State Management**: Primarily `localStorage` for persistence, React `useState` for component-level state, and custom events for cross-component communication (e.g., 'onboarding-complete').
- **Mobile Wrapper**: Capacitor for hybrid mobile app deployment on iOS and Android, integrating native features like StatusBar, SplashScreen, Keyboard, and Haptics.
- **Charting**: Recharts for data visualization in progress tracking and analytics.

### Feature Specifications
- **Revolutionary Onboarding**: Guides users through identity validation, trigger identification, and setting an auto-calculated daily goal (80% of baseline).
- **Static Bottom Navigation**: Provides quick access to Craving Redirect activities, a full-screen Panic Modal, and the User Profile.
- **Panic Modal**: A full-screen breathing exercise with guided animation and a timer to aid in immediate craving management.
- **Craving Redirect Page**: Offers dopamine replacement activities like guided breathing, walks, and quick resets.
- **Profile Page**: Displays the user's identity statement, key metrics (streak, money saved), and access to settings.
- **Puff Counter**: Main screen feature with a circular progress ring indicating progress against the daily limit with color-coded zones (green, amber, red).
- **Progress Tracking**: Dashboard displaying key metrics such as progress percentage, money saved, streak, and health score.
- **Achievements & Gamification**: Rewards users for milestones, streaks, savings, and health improvements.
- **History & Analytics**: Interactive charts with multiple time views (7 days, 2 weeks, 1 month, 1 year).
- **Settings & Customization**: Allows users to adjust habit name, daily goal, cost per unit, and personal motivation messages.

### System Design Choices
- **Data Storage**: Primarily uses in-memory storage with `localStorage` for persistence of user data.
- **Mobile Optimizations**: Responsive design, touch-friendly elements, safe area support for iOS, and dynamic StatusBar updates.
- **Event-Driven Architecture**: Utilizes custom events for seamless state synchronization, particularly for onboarding completion and navigation updates.

## External Dependencies
- **Capacitor**: For building hybrid mobile applications for iOS and Android.
- **Recharts**: JavaScript charting library for data visualization.