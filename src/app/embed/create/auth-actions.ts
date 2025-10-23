
"use server";

import { initializeFirebase } from "@/firebase";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  type User
} from "firebase/auth";

type AuthResult = {
  success: boolean;
  user?: {
    uid: string;
    email: string | null;
  };
  error?: string;
};

// Helper to serialize user object
const serializeUser = (user: User) => ({
  uid: user.uid,
  email: user.email,
});


export async function signUpWithEmail(email: string, password: string): Promise<AuthResult> {
  try {
    const { auth } = initializeFirebase();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: serializeUser(userCredential.user) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  try {
    const { auth } = initializeFirebase();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: serializeUser(userCredential.user) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
