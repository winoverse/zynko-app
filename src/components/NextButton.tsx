import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';

type Props = {
  title?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export default function NextButton({ title = 'Next', onPress, style, disabled }: Props) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.button, pressed && { transform: [{ scale: 0.98 }] }, style, disabled && { opacity: 0.5 }]}>
      <View style={styles.gloss} />
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#63d13a',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderWidth: 3,
    borderColor: '#2fa41b',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    overflow: 'hidden',
  },
  gloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 18,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});


