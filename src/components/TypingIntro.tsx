import React, { useEffect, useMemo, useState } from 'react';
import { StyleProp, Text, TextStyle, View } from 'react-native';

type Props = {
  text: string;
  intervalMs?: number;
  textStyle?: StyleProp<TextStyle>;
};

export default function TypingIntro({ text, intervalMs = 300, textStyle }: Props) {
  const words = useMemo(() => text.split(' '), [text]);
  const [count, setCount] = useState(0);

  // Restart typing when text changes
  useEffect(() => {
    setCount(0);
  }, [text]);

  useEffect(() => {
    if (count >= words.length) return;
    const id = setTimeout(() => setCount((c) => c + 1), intervalMs);
    return () => clearTimeout(id);
  }, [count, words.length, intervalMs]);

  return (
    <View>
      <Text style={textStyle}>
        {words.slice(0, count).join(' ')}
      </Text>
    </View>
  );
}


