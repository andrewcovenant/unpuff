# Addiction Tracking App Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from health and wellness apps like Headspace and Calm, combined with productivity tracking apps like Streaks and Habitica. Focus on supportive, non-judgmental design that encourages progress rather than shame.

## Core Design Principles
- **Supportive & Encouraging**: Use warm, calming colors that reduce anxiety
- **Progress-Focused**: Visual emphasis on achievements and positive momentum
- **Clean & Distraction-Free**: Minimal design to support mental clarity
- **Accessible**: High contrast and clear typography for all users

## Color Palette

### Primary Colors
- **Primary**: 142 69% 58% (Calming teal-green for progress and growth)
- **Secondary**: 220 14% 96% (Soft off-white for backgrounds)
- **Dark Primary**: 142 69% 25% (Darker teal for dark mode)

### Accent Colors
- **Success**: 142 76% 36% (Deeper green for achievements)
- **Warning**: 38 92% 50% (Warm orange for limits, not alarming)
- **Supportive**: 261 51% 51% (Gentle purple for panic button and support features)

### Gradients
- **Hero Background**: Subtle gradient from 142 69% 58% to 180 69% 58%
- **Achievement Cards**: Light gradient from 142 20% 97% to 142 15% 95%

## Typography
- **Primary**: Inter (clean, readable, supportive feel)
- **Accent**: Poppins (for headings and achievement text)
- **Sizes**: Large counter display (4xl-6xl), clear body text (base-lg)

## Layout System
**Spacing Units**: Consistent use of Tailwind units 4, 6, 8, 12, 16
- Generous whitespace for breathing room
- Card-based layouts with rounded corners (rounded-xl)
- Central focus on the puff counter with secondary features in organized sections

## Component Library

### Core Components
- **Large Puff Counter**: Prominent circular button with +/- controls, daily progress ring
- **Panic Button**: Easily accessible, warm purple color, opens supportive modal
- **Progress Cards**: Achievement badges, money saved, health improvements
- **Friend Network**: Simple avatar display with notification settings

### Navigation
- **Bottom Tab Bar**: 4-5 main sections (Counter, Progress, Panic, Friends, Settings)
- **Modal Overlays**: For panic button features and detailed views

### Data Displays
- **Progress Rings**: Visual representation of daily goals and limits
- **Achievement Grid**: Badge-style accomplishments with gentle animations
- **Statistics Cards**: Money saved, days tracked, health metrics

## Images
- **No Large Hero Image**: Focus remains on functional elements
- **Achievement Icons**: Simple, encouraging illustrations for badges
- **Support Feature Icons**: Calming imagery for meditation, breathing exercises
- **Avatar Placeholders**: Friendly, inclusive default profile images

## Key UX Considerations
- **Panic Button Prominence**: Always visible but not anxiety-inducing
- **Positive Reinforcement**: Celebrate small wins with gentle animations
- **Non-Judgmental Tracking**: Present data as progress, not failure
- **Quick Access**: Most important features (counter, panic) accessible in one tap
- **Customizable Goals**: Flexible target setting during onboarding

This design prioritizes mental health support while maintaining functionality, using calming colors and encouraging messaging throughout the user journey.