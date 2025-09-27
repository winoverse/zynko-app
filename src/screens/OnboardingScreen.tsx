import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, View, Text, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import SoundToggle from '../components/SoundToggle';
import { isMuted, setMuted as setGlobalMuted, startBackground, playClick } from '../audio/music';
import DropdownField from '../components/DropdownField';
import DOBPicker from '../components/DOBPicker';
import SignInButton from '../components/SignInButton';
import SweetAlert from 'react-native-sweet-alert';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from '@react-native-firebase/firestore';

export default function OnboardingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [muted, setMuted] = useState(isMuted());
  const [klass, setKlass] = useState<string | null>(null);
  const [board, setBoard] = useState<string | null>(null);
  const [dob, setDob] = useState<{ day: string | null; month: string | null; year: string | null } | undefined>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    startBackground();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/png/onboardingBackground.png')}
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
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.headingTop}>
            <Text style={styles.headingLine1}>Perssonal Details</Text>
            <Text style={styles.subHeading}>fill the information</Text>
          </View>
          <View style={styles.form}>
            <DropdownField
              value={klass}
              onChange={setKlass}
              placeholder="Select Class"
              options={[
                { label: 'Class 6', value: '6' },
                { label: 'Class 7', value: '7' },
                { label: 'Class 8', value: '8' },
                { label: 'Class 9', value: '9' },
                { label: 'Class 10', value: '10' },
                { label: 'Class 11', value: '11' },
                { label: 'Class 12', value: '12' },
              ]}
              containerStyle={styles.field}
            />
            <DropdownField
              value={board}
              onChange={setBoard}
              placeholder="Select State Board"
              options={[
                { label: 'Andhra Pradesh', value: 'AP' },
                { label: 'Arunachal Pradesh', value: 'AR' },
                { label: 'Assam', value: 'AS' },
                { label: 'Bihar', value: 'BR' },
                { label: 'Chhattisgarh', value: 'CT' },
                { label: 'Goa', value: 'GA' },
                { label: 'Gujarat', value: 'GJ' },
                { label: 'Haryana', value: 'HR' },
                { label: 'Himachal Pradesh', value: 'HP' },
                { label: 'Jharkhand', value: 'JH' },
                { label: 'Karnataka', value: 'KA' },
                { label: 'Kerala', value: 'KL' },
                { label: 'Madhya Pradesh', value: 'MP' },
                { label: 'Maharashtra', value: 'MH' },
                { label: 'Manipur', value: 'MN' },
                { label: 'Meghalaya', value: 'ML' },
                { label: 'Mizoram', value: 'MZ' },
                { label: 'Nagaland', value: 'NL' },
                { label: 'Odisha', value: 'OR' },
                { label: 'Punjab', value: 'PB' },
                { label: 'Rajasthan', value: 'RJ' },
                { label: 'Sikkim', value: 'SK' },
                { label: 'Tamil Nadu', value: 'TN' },
                { label: 'Telangana', value: 'TS' },
                { label: 'Tripura', value: 'TR' },
                { label: 'Uttar Pradesh', value: 'UP' },
                { label: 'Uttarakhand', value: 'UT' },
                { label: 'West Bengal', value: 'WB' },
                { label: 'Andaman and Nicobar Islands', value: 'AN' },
                { label: 'Chandigarh', value: 'CH' },
                { label: 'Dadra and Nagar Haveli and Daman and Diu', value: 'DN' },
                { label: 'Delhi', value: 'DL' },
                { label: 'Jammu and Kashmir', value: 'JK' },
                { label: 'Ladakh', value: 'LA' },
                { label: 'Lakshadweep', value: 'LD' },
                { label: 'Puducherry', value: 'PY' },
              ]}
              containerStyle={styles.field}
            />
            <DOBPicker value={dob} onChange={setDob} />
            <SignInButton title={saving ? 'SAVING…' : 'CONFIRM'} disabled={saving} onPress={async () => {
              playClick();
              const d = dob?.day; const m = dob?.month; const y = dob?.year;
              const missing = !klass || !board || !d || !m || !y;
              const toInt = (s: string | null | undefined) => (s ? parseInt(s, 10) : NaN);
              const day = toInt(d); const month = toInt(m); const year = toInt(y);
              const isLeap = (yr: number) => (yr % 4 === 0 && yr % 100 !== 0) || (yr % 400 === 0);
              const daysInMonth = (mm: number, yr: number) => [31, (isLeap(yr) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][mm - 1] || 0;
              const validDate = !missing && month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth(month, year);
              if (missing || !validDate) {
                SweetAlert.showAlertWithOptions({
                  title: 'Missing info',
                  subTitle: 'Please select class, state board, and a valid date of birth',
                  confirmButtonTitle: 'OK',
                  style: 'warning',
                  confirmButtonColor: '#ffd238',
                  cancellable: false,
                }, () => { playClick(); });
                return;
              }
              try {
                setSaving(true);
                const a = getAuth();
                const uid = a.currentUser?.uid;
                if (!uid) {
                  SweetAlert.showAlertWithOptions({
                    title: 'Not signed in',
                    subTitle: 'Please sign in again',
                    confirmButtonTitle: 'OK',
                    style: 'error',
                    confirmButtonColor: '#ffd238',
                    cancellable: false,
                  });
                  return;
                }
                const db = getFirestore();
                await setDoc(doc(db, 'users', uid), {
                  class: klass,
                  board: board,
                  dob: { day, month, year },
                  updatedAt: serverTimestamp(),
                }, { merge: true });
                SweetAlert.showAlertWithOptions({
                  title: 'Saved',
                  subTitle: 'Your details have been recorded',
                  confirmButtonTitle: 'OK',
                  style: 'success',
                  confirmButtonColor: '#ffd238',
                  cancellable: false,
                }, () => { playClick(); navigation.navigate('Dashboard'); });
              } catch (e: any) {
                SweetAlert.showAlertWithOptions({
                  title: 'Save failed',
                  subTitle: e?.message || 'Unable to save details. Please try again.',
                  confirmButtonTitle: 'OK',
                  style: 'error',
                  confirmButtonColor: '#ffd238',
                  cancellable: false,
                }, () => { playClick(); });
              } finally {
                setSaving(false);
              }
            }} style={styles.signInBtn} />
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
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingTop: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 8,
  },
  headingLine1: {
    color: '#000',
    fontSize: 32,
    fontWeight: '800',
  },
  subHeading: {
    color: '#3a3a3a',
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 14,
    marginTop: 12,
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


