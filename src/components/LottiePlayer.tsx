import React from 'react';
import LottieView, { type LottieViewProps } from 'lottie-react-native';
import { StyleProp, ViewStyle } from 'react-native';

type Props = {
  source: LottieViewProps['source'];
  autoPlay?: boolean;
  loop?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function LottiePlayer({ source, autoPlay = true, loop = true, style }: Props) {
  return (
    <LottieView
      source={source}
      autoPlay={autoPlay}
      loop={loop}
      style={style}
    />
  );
}


