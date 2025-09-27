import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LottiePlayer from '../components/LottiePlayer';
import TypingIntro from '../components/TypingIntro';
import NextButton from '../components/NextButton';
import Sound from 'react-native-sound';
import SoundToggle from '../components/SoundToggle';
import { startBackground, setMuted as setGlobalMuted, isMuted } from '../audio/music';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

export default function IntroAppScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const slides = useMemo(
    () => [
      { lottie: require('../assets/images/lottie/firstLottie.json'), text: 'Welcome to Zynko , a gamified education platform to help students' },
      { lottie: require('../assets/images/lottie/secondLottie.json'), text: 'Earn points and unlock rewards while learning every day!' },
      { lottie: require('../assets/images/lottie/thirdLottie.json'), text: 'Track your progress and challenge friends to grow together.' },
    ],
    [],
  );
  const [index, setIndex] = useState(0);
  const clickRef = useRef<Sound | null>(null);
  const [muted, setMuted] = useState(isMuted());

  useEffect(() => {
    startBackground();
    // Preload click sound (Android: android/app/src/main/res/raw/buttonclick.mp3)
    const c = new Sound('buttonclick', Sound.MAIN_BUNDLE, (e) => {
      if (e) {
        console.warn('Click sound load error:', e);
      } else {
        c.setVolume(1.0);
      }
    });
    clickRef.current = c;
    return () => {
      try { clickRef.current?.release(); } catch {}
      clickRef.current = null;
    };
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/png/introBackground.jpg')}
      resizeMode="cover"
      style={styles.bg}
    >
      <View style={styles.overlay}>
        <View style={styles.topRight}>
          <SoundToggle
            muted={muted}
            onToggle={() => {
              const next = !muted;
              setMuted(next);
              setGlobalMuted(next);
            }}
          />
        </View>
        <View style={styles.topGroup}>
          <View style={styles.badgeContainer}>
            <View style={styles.ribbonLeft} />
            <View style={styles.ribbonRight} />
            <View style={styles.badgeBody}>
              <TypingIntro
                text={slides[index].text}
                intervalMs={220}
                textStyle={styles.typing}
              />
            </View>
          </View>
          {/* Indicators directly below the text container */}
          <View style={styles.dotsWrap}>
            {slides.map((_, i) => (
              <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
            ))}
          </View>
        </View>
        <View style={styles.centerGroup}>
          <LottiePlayer
            source={slides[index].lottie}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
        {/* Bottom-centered next button */}
        <View style={styles.footer}>
          <NextButton
            title={index < slides.length - 1 ? 'Next' : 'Start'}
            onPress={() => {
              const c = clickRef.current;
              if (c && c.isLoaded()) {
                try {
                  c.stop();
                } catch {}
                c.setCurrentTime(0);
                c.play();
              } else {
                // Fallback: (re)create and play immediately
                const tmp = new Sound('buttonclick', Sound.MAIN_BUNDLE, (e) => {
                  if (!e) {
                    tmp.setVolume(1.0);
                    tmp.play(() => tmp.release());
                  }
                });
              }
              setIndex((i) => {
                const next = Math.min(i + 1, slides.length - 1);
                if (i === slides.length - 1) {
                  navigation.navigate('SignIn');
                  return i; // unchanged when navigating
                }
                return next;
              });
            }}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topGroup: { alignItems: 'center', justifyContent: 'center' },
  centerGroup: { alignItems: 'center', justifyContent: 'center' },
  topRight: { position: 'absolute', top: 28, right: 16, zIndex: 2, padding: 6 },
  lottie: { width: 320, height: 320, marginBottom: 20 },
  typing: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  spacer: { flex: 1 },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dotsWrap: { marginTop: 20, flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { backgroundColor: '#fff', width: 16, height: 16, borderRadius: 8 },
  badgeContainer: {
    marginTop: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeBody: {
    minWidth: 280,
    maxWidth: '85%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ff7f32',
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#ffd27a',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  ribbonLeft: {
    position: 'absolute',
    left: -28,
    width: 36,
    height: 18,
    backgroundColor: '#ffb255',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    transform: [{ rotate: '-12deg' }],
  },
  ribbonRight: {
    position: 'absolute',
    right: -28,
    width: 36,
    height: 18,
    backgroundColor: '#ffb255',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    transform: [{ rotate: '12deg' }],
  },
});


