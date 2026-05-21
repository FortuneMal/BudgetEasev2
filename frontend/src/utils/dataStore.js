import { supabase } from './supabase';

// Helper to reliably load user-scoped data
export const loadUserData = async (userId, key, defaultValue = []) => {
  if (!userId) return defaultValue;

  try {
    // 1. Check Supabase user_metadata
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.user_metadata && user.user_metadata[key]) {
      // Sync down to local storage
      localStorage.setItem(`${key}_${userId}`, JSON.stringify(user.user_metadata[key]));
      return user.user_metadata[key];
    }
  } catch (err) {
    console.warn('Could not load from Supabase metadata:', err);
  }

  // 2. Fallback to localStorage
  const localData = localStorage.getItem(`${key}_${userId}`);
  if (localData) {
    return JSON.parse(localData);
  }

  return defaultValue;
};

// Helper to save user-scoped data
export const saveUserData = async (userId, key, data) => {
  if (!userId) return;

  // 1. Fast local save
  localStorage.setItem(`${key}_${userId}`, JSON.stringify(data));

  // 2. Sync to Supabase user_metadata
  try {
    await supabase.auth.updateUser({
      data: {
        [key]: data
      }
    });
  } catch (err) {
    console.error('Failed to sync to Supabase metadata:', err);
  }
};
