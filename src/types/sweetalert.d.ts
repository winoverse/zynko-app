declare module 'react-native-sweet-alert' {
  type Style = 'success' | 'error' | 'warning' | 'none';
  interface Options {
    title?: string;
    subTitle?: string;
    confirmButtonTitle?: string;
    confirmButtonColor?: string; // iOS only per lib, harmless on Android
    otherButtonTitle?: string;
    otherButtonColor?: string; // iOS only per lib, harmless on Android
    style?: Style;
    cancellable?: boolean;
  }

  const SweetAlert: {
    showAlertWithOptions: (options: Options, callback?: (confirmed: boolean) => void) => void;
    resetCount?: () => void;
    isSpinning?: () => Promise<boolean>;
    spin?: () => void;
    setBarColor?: (hexColor: string) => void;
  };

  export default SweetAlert;
}


