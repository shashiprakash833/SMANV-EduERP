/**
 * SMANV EduERP Cross-Platform Storage Service
 * Uses Expo SecureStore on Native platforms and AsyncStorage/LocalStorage on Web.
 */

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const isWeb = Platform.OS === 'web';

/**
 * Save secure sensitive data (e.g. JWT tokens)
 */
export async function setSecureItem(key: string, value: string): Promise<void> {
  try {
    if (isWeb) {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.warn(`Storage set error for key ${key}:`, error);
  }
}

/**
 * Get secure sensitive data
 */
export async function getSecureItem(key: string): Promise<string | null> {
  try {
    if (isWeb) {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return await AsyncStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.warn(`Storage get error for key ${key}:`, error);
    return null;
  }
}

/**
 * Remove sensitive data
 */
export async function removeSecureItem(key: string): Promise<void> {
  try {
    if (isWeb) {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.warn(`Storage remove error for key ${key}:`, error);
  }
}

/**
 * Regular JSON storage for app cache & offline queue
 */
export async function setJsonItem<T>(key: string, data: T): Promise<void> {
  try {
    const jsonString = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonString);
  } catch (e) {
    console.warn(`JSON storage error for ${key}:`, e);
  }
}

export async function getJsonItem<T>(key: string): Promise<T | null> {
  try {
    const jsonString = await AsyncStorage.getItem(key);
    if (!jsonString) return null;
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.warn(`JSON retrieval error for ${key}:`, e);
    return null;
  }
}

// -------------------------------------------------------------
// SMANV Auth Token & Profile Storage Keys & Helpers
// -------------------------------------------------------------

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'smanv_access_token',
  REFRESH_TOKEN: 'smanv_refresh_token',
  USER_ROLE: 'smanv_user_role',
  USER_PROFILE: 'smanv_user_profile',
  ORGANIZATION: 'smanv_organization',
  THEME_MODE: 'smanv_theme_mode',
};

export async function saveTokens(access: string, refresh: string): Promise<void> {
  await Promise.all([
    setSecureItem(STORAGE_KEYS.ACCESS_TOKEN, access),
    setSecureItem(STORAGE_KEYS.REFRESH_TOKEN, refresh),
  ]);
}

export async function getAccessToken(): Promise<string | null> {
  return await getSecureItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export async function getRefreshToken(): Promise<string | null> {
  return await getSecureItem(STORAGE_KEYS.REFRESH_TOKEN);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    removeSecureItem(STORAGE_KEYS.ACCESS_TOKEN),
    removeSecureItem(STORAGE_KEYS.REFRESH_TOKEN),
  ]);
}

export async function clearAuthData(): Promise<void> {
  await clearTokens();
  await Promise.all([
    removeSecureItem(STORAGE_KEYS.USER_ROLE),
    removeSecureItem(STORAGE_KEYS.USER_PROFILE),
    removeSecureItem(STORAGE_KEYS.ORGANIZATION),
  ]);
}

