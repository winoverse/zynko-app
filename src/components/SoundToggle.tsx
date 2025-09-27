import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle, StyleProp, View } from 'react-native';

type Props = {
  muted: boolean;
  onToggle: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function SoundToggle({ muted, onToggle, style }: Props) {
  const bg = muted ? styles.red : styles.green;
  const emoji = muted ? '🔇' : '🔊';
  return (
    <Pressable onPress={onToggle} style={({ pressed }) => [styles.container, bg, pressed && { transform: [{ scale: 0.96 }] }, style]}>
      <View style={styles.inner}>
        <Text style={styles.icon}>{emoji}</Text>
      </View>
    </Pressable>
  );
}

const SIZE = 46;

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(0,0,0,0.2)',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    color: '#fff',
  },
  green: { backgroundColor: '#38b000' },
  red: { backgroundColor: '#d00000' },
});


