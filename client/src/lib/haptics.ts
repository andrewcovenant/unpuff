import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

export { ImpactStyle };

export async function triggerHaptic(style: ImpactStyle): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    try {
      await Haptics.impact({ style });
    } catch (error) {
      console.error('Haptic feedback failed:', error);
    }
  } else if (navigator.vibrate) {
    // Web fallback using Vibration API
    const duration = style === ImpactStyle.Light ? 10 : style === ImpactStyle.Medium ? 20 : 30;
    try {
      navigator.vibrate(duration);
    } catch (error) {
      console.error('Web vibration failed:', error);
    }
  }
}
