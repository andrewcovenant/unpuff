# QuitTracker Design System

## 🎨 Color Palette

### Core Colors (Dark Mode)
- **Background**: `#0B0F14` (ink navy) - Main app background
- **Surface**: `#111824` - Elevated panels and cards
- **Primary**: `#22D3EE` (electric cyan) - Actions, highlights, CTAs
- **Accent**: `#A78BFA` (soft violet) - Secondary emphasis, charts
- **Success**: `#34D399` (mint) - Wins, streaks, goals achieved
- **Warning**: `#F59E0B` (amber) - Near-limit warnings
- **Error**: `#F43F5E` (rose) - Limit exceeded, errors
- **Text**: `#E6EDF6` - Primary text color
- **Text Muted**: `#9FB0C5` - Secondary/supporting text
- **Border**: `#1F2A37` - Separators and outlines

### Neutrals
- 900: `#0B0F14`
- 800: `#111824`
- 700: `#17202B`
- 600: `#1F2A37`
- 500: `#2A3A4B`
- 400: `#3D4D5E`
- 300: `#647489`
- 200: `#9FB0C5`
- 100: `#D6DFEA`
- 50: `#F2F6FA`

### Gradients
- **Primary Gradient**: `linear-gradient(135deg, #22D3EE 0%, #A78BFA 100%)`
- **Panic Gradient**: `linear-gradient(135deg, #F43F5E 0%, #FB7185 100%)`

### Widget Heat Colors (Limit Proximity)
- **Safe** (≤50% of limit): `#34D399` (success)
- **Caution** (50-90%): `#F59E0B` (warning)
- **Danger** (≥90% or exceeded): `#F43F5E` (error)

## 🔠 Typography

### Font Stack
- **Display/Headlines**: Space Grotesk (600-700 weight)
- **Body/UI**: Inter (400-600 weight)

### Font Sizes (Mobile-First)
- **display-1**: 48px/52px (3rem/3.25rem) - Campaign lines, hero
- **display-2**: 36px/40px (2.25rem/2.5rem) - Section headers
- **h1**: 28px/34px (1.75rem/2.125rem)
- **h2**: 22px/28px (1.375rem/1.75rem)
- **h3**: 18px/24px (1.125rem/1.5rem)
- **body-1**: 16px/24px (1rem/1.5rem) - Default body text
- **body-2**: 14px/20px (0.875rem/1.25rem) - Metadata, helper text
- **label**: 12px/16px (0.75rem/1rem) - Labels, chips (uppercase)

### Font Weights
- Display/H1: **700** (bold)
- H2/H3: **600** (semibold)
- Body/Label: **400-500** (regular/medium)

### Letter Spacing
- Display: **-0.5%**
- Labels (uppercase): **+4%**

## 📏 Spacing & Layout

### 8pt Spacing Scale
- xxs: `4px`
- xs: `8px`
- sm: `12px`
- md: `16px`
- lg: `24px`
- xl: `32px`
- 2xl: `48px`
- 3xl: `64px`

### Component Layout
- **Screen gutters**: 16px (mobile), 24-32px (tablet), 48px (desktop)
- **Card padding**: 16-20px
- **List item row height**: 56px (with 16px inset)
- **Touch targets**: 44x44px minimum

### Border Radii
- **sm**: `8px` - Inputs, chips
- **md**: `12px` - Buttons, tags
- **lg**: `16px` - Cards
- **xl**: `24px` - Modals, hero containers
- **pill**: `999px` - Pills, progress capsules

## 🌑 Shadows (Dark Mode)

- **shadow-sm**: `0 1px 0 #0D141D, 0 1px 2px rgba(0,0,0,0.3)`
- **shadow-md**: `0 0 0 1px #1F2A37, 0 8px 24px rgba(0,0,0,0.35)`
- **shadow-lg**: `0 0 0 1px #2A3A4B, 0 16px 40px rgba(0,0,0,0.45)`

## 🔖 Component Patterns

### Primary Button (Filled)
- Background: `#22D3EE` (primary)
- Text: `#0B0F14` (bg)
- Radius: `12px`
- Shadow: `md`

### Primary Button (Ghost)
- Text: `#22D3EE` (primary)
- Ring: `#22D3EE` @ 24% opacity on press

### Destructive Button
- Background: `#F43F5E` (error)
- Text: `#0B0F14` (bg)

### Success Badge
- Background: `#063C2E` (success-10)
- Text: `#34D399` (success)
- Ring: `#195F4B`

### Warning Chip
- Background: `#3B2A0B`
- Text: `#F59E0B` (warning)

### Error Banner
- Background: `#3B0D18`
- Border: `#783041`
- Text: `#FBD5E0`

### Input Field
- Background: `#111824` (surface)
- Border: `#1F2A37` (border)
- Focus ring: `#22D3EE` (primary) - 2px

### Panic Button
- Background: `linear-gradient(135deg, #F43F5E 0%, #FB7185 100%)`
- Text: `#0B0F14` (bg)
- Radius: `24px`
- Min size: `56px`
- Pressed state: Add outer glow `0 0 0 8px rgba(244,63,94,0.25)`

## 📊 Widget Color Thresholds

Progress indicator colors based on usage:

- **≤50% of limit**: `#34D399` (success) - Safe zone
- **50-90% of limit**: `#F59E0B` (warning) - Approaching limit
- **≥90% or exceeded**: `#F43F5E` (error) - Over limit

## 🎯 Design Principles

1. **Calming & Non-Judgmental**: Use soft gradients and warm feedback
2. **Mobile-First**: All layouts optimized for touch interaction
3. **Progressive Feedback**: Visual cues that evolve based on behavior
4. **Dark by Default**: Optimized for low-light usage and focus
5. **Accessibility**: Maintain WCAG AA contrast ratios throughout
