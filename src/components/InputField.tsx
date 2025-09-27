import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, ViewStyle, StyleProp } from 'react-native';
import MailIcon from '../assets/images/svg/email_icon.svg';
import LockIcon from '../assets/images/svg/password_icon.svg';
import UserIcon from '../assets/images/svg/user_icon.svg';

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  containerStyle?: StyleProp<ViewStyle>;
  icon?: 'mail' | 'lock' | 'user';
};

export default function InputField({ value, onChangeText, placeholder, secureTextEntry, keyboardType, containerStyle, icon = 'mail' }: Props) {
  return (
    <View style={[styles.wrap, containerStyle]}
      pointerEvents="box-none">
      <View style={styles.iconWrap}>
        {icon === 'mail' && <MailIcon width={24} height={24} />}
        {icon === 'lock' && <LockIcon width={24} height={24} />}
        {icon === 'user' && <UserIcon width={24} height={24} />}
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#7a7a7a"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize="none"
        secureTextEntry={secureTextEntry}
        allowFontScaling={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#111',
    fontSize: 16,
    fontWeight: '700',
  },
});


