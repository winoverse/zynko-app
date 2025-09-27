import React, { useEffect, useRef, useState } from 'react';
import { ImageBackground, StyleSheet, View, Text, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import InputField from '../components/InputField';
import SoundToggle from '../components/SoundToggle';
import { isMuted, setMuted as setGlobalMuted, startBackground, playClick } from '../audio/music';
import SignInButton from '../components/SignInButton';
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';
import { saveUid } from '../utils/authLocal';
import SweetAlert from 'react-native-sweet-alert';
import { getFriendlyAuthErrorMessage } from '../utils/authErrors';

export default function SignInScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(isMuted());
  const postSignInCheckRef = useRef<Promise<boolean> | null>(null);

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
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <View style={styles.headingWrap}>
              <Text style={styles.headingLine1}>Sign in to your</Text>
              <Text style={styles.headingLine2}>Account</Text>
              <Text style={styles.subHeading}>Login with your email address</Text>
            </View>
            <InputField
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              icon="mail"
              containerStyle={styles.field}
            />
            <InputField
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
              icon="lock"
              containerStyle={styles.field}
            />
            <View style={styles.rowRight}><Text style={styles.linkText}>Forgot your password?</Text></View>
            <SignInButton
              onPress={async () => {
                playClick();
                if (loading) return;
                if (!email || !password) {
                  SweetAlert.showAlertWithOptions({
                    title: 'Missing info',
                    subTitle: 'Please enter email and password',
                    confirmButtonTitle: 'OK',
                    style: 'warning',
                    confirmButtonColor: '#ffd238',
                    cancellable: false,
                  }, () => { playClick(); });
                  return;
                }
                try {
                  setLoading(true);
                  const a = getAuth();
              await signInWithEmailAndPassword(a, email.trim(), password);
              const uidSigned = getAuth().currentUser?.uid;
              if (uidSigned) { saveUid(uidSigned); }
              // Start checking onboarding data immediately in parallel with the alert
              try {
                const uidNow = getAuth().currentUser?.uid;
                if (uidNow) {
                  const db = getFirestore();
                  postSignInCheckRef.current = getDoc(doc(db, 'users', uidNow)).then((snap) => {
                    const data: any = (typeof (snap as any).exists === 'function' ? (snap as any).exists() : (snap as any).exists) ? snap.data() : undefined;
                    return !!(data && data.class && data.board && data.dob && data.dob.day && data.dob.month && data.dob.year);
                  }).catch(() => false);
                } else {
                  postSignInCheckRef.current = Promise.resolve(false);
                }
              } catch {
                postSignInCheckRef.current = Promise.resolve(false);
              }
              SweetAlert.showAlertWithOptions({
                    title: 'Welcome',
                    subTitle: 'Signed in successfully',
                    confirmButtonTitle: 'OK',
                    style: 'success',
                    confirmButtonColor: '#ffd238',
                cancellable: false,
              }, async () => {
                playClick();
                const hasAll = await (postSignInCheckRef.current || Promise.resolve(false));
                navigation.navigate(hasAll ? 'Dashboard' : 'Onboarding');
              });
                } catch (e: any) {
                  SweetAlert.showAlertWithOptions({
                    title: 'Sign in failed',
                    subTitle: getFriendlyAuthErrorMessage(e),
                    confirmButtonTitle: 'OK',
                    style: 'error',
                    confirmButtonColor: '#ffd238',
                    cancellable: false,
                  }, () => { playClick(); });
                } finally {
                  setLoading(false);
                }
              }}
              style={styles.signInBtn}
              title={loading ? 'PLEASE WAIT…' : 'LOGIN'}
            />
            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Don't have an account? </Text>
              <Text style={styles.bottomLink} onPress={() => navigation.navigate('SignUp')}>Register Now</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: 24,
  },
  topLeft: { position: 'absolute', top: 28, left: 16, zIndex: 2, padding: 6 },
  form: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 80,
    paddingHorizontal: 24,
    gap: 14,
  },
  headingWrap: {
    alignItems: 'center',
    marginBottom: 12,
  },
  headingLine1: {
    color: '#000',
    fontSize: 38,
    fontWeight: '800',
  },
  headingLine2: {
    color: '#000',
    fontSize: 38,
    fontWeight: '800',
    marginTop: 0,
    marginBottom: 6,
  },
  subHeading: {
    color: '#3a3a3a',
    fontSize: 18,
    fontWeight: '600',
  },
  field: {
    backgroundColor: '#ffffff',
    maxWidth: 320,
    alignSelf: 'center',
  },
  rowRight: {
    width: '100%',
    alignSelf: 'stretch',
    paddingHorizontal: 24,
    alignItems: 'flex-end',
  },
  rowLeft: {
    maxWidth: 320,
    alignSelf: 'center',
    alignItems: 'flex-start',
  },
  linkText: {
    color: '#2d2d2d',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
  },
  signInBtn: {
    width: 320,
    alignSelf: 'center',
    marginTop: 8,
  },
  bottomRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    color: '#1b1b1b',
    fontSize: 16,
    fontWeight: '800',
  },
  bottomLink: {
    color: '#ff7f32',
    fontSize: 16,
    fontWeight: '800',
  },
});


