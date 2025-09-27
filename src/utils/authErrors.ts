export function getFriendlyAuthErrorMessage(error: unknown): string {
  const code = typeof error === 'object' && error && 'code' in (error as any)
    ? String((error as any).code)
    : '';

  switch (code) {
    case 'auth/wrong-password':
    case 'auth/invalid-password':
      return 'The password you entered is incorrect. Please try again.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please check or register.';
    case 'auth/invalid-email':
      return 'The email address looks invalid. Please check and try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/email-already-in-use':
      return 'That email is already registered. Try signing in instead.';
    case 'auth/weak-password':
      return 'Your password is too weak. Use at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    default:
      // Fallback to message if available
      const msg = typeof error === 'object' && error && 'message' in (error as any)
        ? String((error as any).message)
        : 'Something went wrong. Please try again.';
      return msg;
  }
}


