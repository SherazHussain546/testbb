
'use server';

import {
  signOut,
} from 'firebase/auth';
import { initializeFirebase } from '@/firebase';

export async function handleSignOut() {
    try {
        const { auth } = initializeFirebase();
        await signOut(auth);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
