import RNBootSplash from 'react-native-bootsplash';

export async function hideBootSplash(): Promise<void> {
  try {
    // Show native splash for 3s, then fade out
    await new Promise<void>((resolve) => setTimeout(resolve, 3000));
    await RNBootSplash.hide({ fade: true });
  } catch {
    // no-op
  }
}
 
