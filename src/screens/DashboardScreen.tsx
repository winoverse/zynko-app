import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, View, Text } from 'react-native';
import SoundToggle from '../components/SoundToggle';
import { isMuted, setMuted as setGlobalMuted, startBackground } from '../audio/music';

export default function DashboardScreen() {
  const [muted, setMuted] = useState(isMuted());

  useEffect(() => {
    startBackground();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/png/authBackground.jpg')}
      resizeMode="cover"
      style={styles.bg}
    >
      <View style={styles.topLeft}>
        <SoundToggle
          muted={muted}
          onToggle={() => {
            const next = !muted;
            setMuted(next);
            setGlobalMuted(next);
          }}
        />
      </View>
      <View style={styles.centerWrap}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Welcome to Zynko!</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  topLeft: { position: 'absolute', top: 28, left: 16, zIndex: 2, padding: 6 },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#000',
    fontSize: 36,
    fontWeight: '800',
  },
  subtitle: {
    color: '#3a3a3a',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 6,
  },
});


