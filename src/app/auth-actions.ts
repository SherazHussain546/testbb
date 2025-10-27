
'use server';

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { initializeFirebase } from '@/firebase';

type State = {
  success: boolean;
  error?: string;
};

export async function signInWithEmail(
  prevState: State,
  formData: FormData
): Promise<State> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  try {
    const { auth } = initializeFirebase();
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error: any) {
    let errorMessage = 'An unknown error occurred.';
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No user found with this email.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password. Please try again.';
        break;
      case 'auth/invalid-credential':
          errorMessage = 'Invalid credentials. Please check your email and password.';
          break;
      default:
        errorMessage = error.message;
        break;
    }
    return { success: false, error: errorMessage };
  }
}

export async function handleSignOut() {
    try {
        const { auth } = initializeFirebase();
        await signOut(auth);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
