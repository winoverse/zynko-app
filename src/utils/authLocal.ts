import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'zynko.auth.uid';

export async function saveUid(uid: string): Promise<void> {
  try { await AsyncStorage.setItem(KEY, uid); } catch {}
}

export async function getUid(): Promise<string | null> {
  try { return await AsyncStorage.getItem(KEY); } catch { return null; }
}

export async function clearUid(): Promise<void> {
  try { await AsyncStorage.removeItem(KEY); } catch {}
}


