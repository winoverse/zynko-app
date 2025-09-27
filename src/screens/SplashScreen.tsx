import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { getUid } from '../utils/authLocal';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

export default function SplashScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0)).current; // 0 -> 1 maps to 0.9 -> 1.05
  const dotAnims = useMemo(() => [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)], []);
  const [showLoader, setShowLoader] = useState(false);
  const [uidVal, setUidVal] = useState<string | null | undefined>(undefined);
  const uidPromiseRef = useRef<Promise<string | null> | null>(null);
  const navigatedRef = useRef(false);

  useEffect(() => {
    // Begin checking local auth in parallel with animation
    uidPromiseRef.current = getUid().then((u) => { setUidVal(u); return u; }).catch(() => { setUidVal(null); return null; });
    // Run fade-in + zoom-in in parallel over 3s
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 3000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowLoader(true);
      // Start interactive bouncing dots (staggered), then finish after 5s
      dotAnims.forEach((val, i) => {
        const loop = Animated.loop(
          Animated.sequence([
            Animated.timing(val, { toValue: 1, duration: 400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            Animated.timing(val, { toValue: 0, duration: 400, easing: Easing.in(Easing.quad), useNativeDriver: true }),
          ]),
        );
        setTimeout(() => loop.start(), i * 150);
        // Stop loops when screen ends
        setTimeout(() => loop.stop(), 5000);
      });
      setTimeout(async () => {
        if (navigatedRef.current) return;
        const uid = uidVal !== undefined ? uidVal : await (uidPromiseRef.current || Promise.resolve(null));
        if (navigatedRef.current) return;
        navigatedRef.current = true;
        if (uid) {
          navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
        } else {
          navigation.reset({ index: 0, routes: [{ name: 'Intro' }] });
        }
      }, 5000);
    });
  }, [logoOpacity, logoScale, dotAnims, navigation, uidVal]);

  const scale = logoScale.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.05] });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/images/png/brandlogo.png')}
        resizeMode="contain"
        style={[styles.logo, { opacity: logoOpacity, transform: [{ scale }] }]} />
      {showLoader ? (
        <View style={styles.dotsRow}>
          {dotAnims.map((val, idx) => {
            const translateY = val.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
            const opacity = val.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });
            return <Animated.View key={idx} style={[styles.dot, { transform: [{ translateY }], opacity }]} />;
          })}
        </View>
      ) : null}
    </View>
  );
}

const LOADER_SIZE = 36;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 260,
    height: 260,
    marginBottom: 12,
  },
  loader: {
    width: LOADER_SIZE,
    height: LOADER_SIZE,
    borderRadius: LOADER_SIZE / 2,
    borderWidth: 3,
    borderColor: '#fdd605',
    borderTopColor: 'transparent',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fdd605',
    marginHorizontal: 6,
  },
});

