
'use server';

import {
  signOut,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { initializeFirebase } from '@/firebase';
import type { User } from "firebase/auth";

type AuthResult = {
  success: boolean;
  user?: {
    uid: string;
    email: string | null;
  };
  error?: string;
};

// Helper to serialize user object because the full User object is not serializable
const serializeUser = (user: User) => ({
  uid: user.uid,
  email: user.email,
});


export async function signInWithEmail(prevState: any, formData: FormData): Promise<AuthResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const { auth } = initializeFirebase();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: serializeUser(userCredential.user) };
  } catch (error: any) {
     let errorMessage = "An unknown error occurred.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password. Please try again.";
      } else {
        errorMessage = error.message;
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
