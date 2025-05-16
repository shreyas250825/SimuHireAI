// lib/auth.ts

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase"; // make sure you have lib/firebase.ts set up
import { supabase } from "./supabase"; // make sure you have lib/supabase.ts set up

export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    // Add scopes
    provider.addScope('profile');
    provider.addScope('email');
    
    // Set custom parameters
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (!user) {
      throw new Error('No user returned from Google sign in');
    }

    // 🔄 Upsert user in Supabase
    const { error } = await supabase.from("users").upsert({
      id: user.uid,
      email: user.email,
      name: user.displayName,
      role: "candidate", // default role
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    return user;
  } catch (error: any) {
    console.error("Google Login Error:", {
      code: error.code,
      message: error.message,
      details: error.details
    });
    throw error;
  }
};
