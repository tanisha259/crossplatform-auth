import { useEffect, useCallback, useReducer } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => Promise<void>];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null]
): [[boolean, T | null], (action: T | null) => void] {
  return useReducer(
    (_state: [boolean, T | null], action: T | null): [boolean, T | null] => [
      false,
      action,
    ],
    initialValue
  );
}

export async function setStorageItemAsync(key: string, value: string | null) {
  if (Platform.OS === 'web') {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (value === null) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, value);
        }
      }
    } catch (e) {
      console.warn('Local storage error:', e);
    }
  } else {
    try {
      if (value === null) {
        await SecureStore.deleteItemAsync(key);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (e) {
      console.warn('SecureStore error:', e);
    }
  }
}

export async function getStorageItemAsync(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn('Local storage read error:', e);
    }
    return null;
  } else {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (e) {
      console.warn('SecureStore read error:', e);
      return null;
    }
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>();

  useEffect(() => {
    let isMounted = true;
    getStorageItemAsync(key).then((value) => {
      if (isMounted) {
        setState(value);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [key, setState]);

  const setValue = useCallback(
    async (value: string | null) => {
      setState(value);
      await setStorageItemAsync(key, value);
    },
    [key, setState]
  );

  return [state, setValue];
}
