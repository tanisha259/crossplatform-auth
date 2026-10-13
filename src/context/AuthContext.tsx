import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { User, Session } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import { getStorageItemAsync, setStorageItemAsync } from '../hooks/useStorageState';
import { authService, GoogleUserProfile } from '../services/authService';
import { databaseService } from '../services/databaseService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  allowedDomains: string[];
  clearError: () => void;
  signInWithGoogleProfile: (
    profile: GoogleUserProfile,
    token?: string
  ) => Promise<{ success: boolean; error?: string }>;
  loginWithTestAccount: (
    email: string,
    name?: string
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshDomains: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [allowedDomains, setAllowedDomains] = useState<string[]>([]);

  // Load session and domains on app startup
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        const [storedSession, domains] = await Promise.all([
          getStorageItemAsync(STORAGE_KEYS.SESSION),
          databaseService.getAllowedDomains(),
        ]);

        if (isMounted) {
          setAllowedDomains(domains);
          if (storedSession) {
            const parsedSession: Session = JSON.parse(storedSession);
            // Check session expiry
            if (parsedSession.expiresAt && parsedSession.expiresAt > Date.now()) {
              setSession(parsedSession);
              setUser(parsedSession.user);
            } else {
              // Expired session: clear it
              await setStorageItemAsync(STORAGE_KEYS.SESSION, null);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load initial session:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshDomains = useCallback(async () => {
    const domains = await databaseService.getAllowedDomains();
    setAllowedDomains(domains);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user) return;
    const users = await databaseService.getUsers();
    const updated = users.find((u) => u.id === user.id);
    if (updated) {
      setUser(updated);
      if (session) {
        const newSession = { ...session, user: updated };
        setSession(newSession);
        await setStorageItemAsync(
          STORAGE_KEYS.SESSION,
          JSON.stringify(newSession)
        );
      }
    }
  }, [user, session]);

  /**
   * Completes sign in after obtaining Google profile
   */
  const signInWithGoogleProfile = useCallback(
    async (
      profile: GoogleUserProfile,
      token?: string
    ): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await authService.processGoogleUserLogin(profile, token);

        if (!result.success || !result.session || !result.user) {
          setError(result.error || 'Authentication failed');
          return { success: false, error: result.error };
        }

        setSession(result.session);
        setUser(result.user);
        await setStorageItemAsync(
          STORAGE_KEYS.SESSION,
          JSON.stringify(result.session)
        );

        return { success: true };
      } catch (err: any) {
        const msg = err.message || 'An unexpected error occurred during sign-in.';
        setError(msg);
        return { success: false, error: msg };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Test/Demo account sign in (allows testing alex@hbplus.fit and unauthorized example@gmail.com)
   */
  const loginWithTestAccount = useCallback(
    async (
      email: string,
      name?: string
    ): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await authService.simulateGoogleLogin(email, name);

        if (!result.success || !result.session || !result.user) {
          setError(result.error || 'Authentication failed');
          return { success: false, error: result.error };
        }

        setSession(result.session);
        setUser(result.user);
        await setStorageItemAsync(
          STORAGE_KEYS.SESSION,
          JSON.stringify(result.session)
        );

        return { success: true };
      } catch (err: any) {
        const msg = err.message || 'An unexpected error occurred during test sign-in.';
        setError(msg);
        return { success: false, error: msg };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Signs the user out, cleans persistent session tokens
   */
  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await setStorageItemAsync(STORAGE_KEYS.SESSION, null);
      setUser(null);
      setSession(null);
      setError(null);
    } catch (err) {
      console.warn('Sign out error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        error,
        isAdmin,
        allowedDomains,
        clearError,
        signInWithGoogleProfile,
        loginWithTestAccount,
        signOut,
        refreshUser,
        refreshDomains,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
