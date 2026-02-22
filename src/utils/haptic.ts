export function haptic(type: 'light' | 'medium' | 'heavy' = 'light') {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    const pattern = type === 'light' ? 10 : type === 'medium' ? 20 : 30;
    navigator.vibrate(pattern);
  }
}
