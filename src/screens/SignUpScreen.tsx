import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, View, Text, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
import SoundToggle from '../components/SoundToggle';
import { isMuted, setMuted as setGlobalMuted, startBackground, playClick } from '../audio/music';
import InputField from '../components/InputField';
import SignInButton from '../components/SignInButton';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from '@react-native-firebase/auth';
import { saveUid } from '../utils/authLocal';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from '@react-native-firebase/firestore';
import SweetAlert from 'react-native-sweet-alert';
import { getFriendlyAuthErrorMessage } from '../utils/authErrors';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

export default function SignUpScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [muted, setMuted] = useState(isMuted());
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    startBackground();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/png/authBackground2.png')}
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
      <View style={styles.headingTop}>
        <Text style={styles.headingLine1}>Register</Text>
        <Text style={styles.subHeading}>Enter your details below</Text>
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
            <InputField
              value={name}
              onChangeText={setName}
              placeholder="Full Name"
              icon="user"
              containerStyle={styles.field}
            />
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
            <InputField
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Confirm Password"
              secureTextEntry
              icon="lock"
              containerStyle={styles.field}
            />
        <SignInButton
              title={loading ? 'REGISTERING…' : 'REGISTER'}
              onPress={async () => {
            playClick();
                if (loading) return;
                if (!name || !email || !password || !confirm) {
              SweetAlert.showAlertWithOptions({
                    title: 'Missing info',
                    subTitle: 'Please fill all fields',
                    confirmButtonTitle: 'OK',
                    style: 'warning',
                    confirmButtonColor: '#ffd238',
                cancellable: false,
              }, () => { playClick(); });
                  return;
                }
                if (password !== confirm) {
              SweetAlert.showAlertWithOptions({
                    title: 'Password mismatch',
                    subTitle: 'Password and confirm must match',
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
              const cred = await createUserWithEmailAndPassword(a, email.trim(), password);
                  await updateProfile(a.currentUser!, { displayName: name });
                  // Persist user profile to Firestore (modular API)
                  const db = getFirestore();
                  await setDoc(doc(collection(db, 'users'), cred.user.uid), {
                    uid: cred.user.uid,
                    name: name,
                    email: cred.user.email,
                    createdAt: serverTimestamp(),
                  });
                  SweetAlert.showAlertWithOptions({
                    title: 'Success',
                    subTitle: 'Account created',
                    confirmButtonTitle: 'OK',
                    style: 'success',
                    confirmButtonColor: '#ffd238',
                    cancellable: false,
              }, () => {
                    playClick();
                try { saveUid(cred.user.uid); } catch {}
                    navigation.navigate('Onboarding');
                  });
                } catch (e: any) {
              SweetAlert.showAlertWithOptions({
                    title: 'Register failed',
                    subTitle: getFriendlyAuthErrorMessage(e),
                    confirmButtonTitle: 'OK',
                    style: 'error',
                    confirmButtonColor: '#ffd238',
                cancellable: false,
              }, () => { playClick(); });
                }
                finally {
                  setLoading(false);
                }
              }}
              style={styles.signInBtn}
              disabled={loading}
            />
            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Already have an account? </Text>
              <Text style={styles.bottomLink} onPress={() => navigation.navigate('SignIn')}>Sign in here</Text>
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
  topLeft: { position: 'absolute', top: 28, left: 16, zIndex: 2, padding: 6 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: 24,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 120,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 14,
  },
  headingTop: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headingLine1: {
    color: '#000',
    fontSize: 38,
    fontWeight: '800',
  },
  subHeading: {
    color: '#3a3a3a',
    fontSize: 18,
    fontWeight: '600',
  },
  field: {
    backgroundColor: '#ffffff',
    width: 320,
    alignSelf: 'center',
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


