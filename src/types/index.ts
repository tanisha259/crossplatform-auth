export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  domain: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface Session {
  user: User;
  token: string;
  refreshToken?: string;
  expiresAt: number;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuditLog {
  id: string;
  email: string;
  timestamp: string;
  status: 'allowed' | 'restricted';
  reason?: string;
  platform: 'web' | 'android' | 'ios';
}

export interface DomainConfig {
  allowedDomains: string[];
  requireEmailVerification: boolean;
}
