import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

type Props = {
  title?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export default function SignInButton({ title = 'LOGIN', onPress, style, disabled }: Props) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.button, pressed && { transform: [{ scale: 0.98 }] }, style, disabled && { opacity: 0.5 }]}>
      <View style={styles.gloss} />
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const BTN_H = 58;

const styles = StyleSheet.create({
  button: {
    height: BTN_H,
    backgroundColor: '#ffd238', // bright yellow
    borderRadius: 14, // box with rounded corners
    borderWidth: 2,
    borderColor: '#e0a92b', // darker yellow edge
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    overflow: 'hidden',
  },
  gloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: BTN_H * 0.35,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  text: {
    color: '#c65605', // orange text like reference
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
});


