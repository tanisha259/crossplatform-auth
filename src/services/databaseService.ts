import { Platform } from 'react-native';
import { User, UserRole, AuditLog } from '../types';
import {
  ADMIN_EMAILS,
  DEFAULT_ALLOWED_DOMAINS,
  STORAGE_KEYS,
} from '../utils/constants';
import { extractDomain } from '../utils/domainValidator';
import { getStorageItemAsync, setStorageItemAsync } from '../hooks/useStorageState';

// Initial pre-seeded users for demo & audit consistency
const INITIAL_SEED_USERS: User[] = [
  {
    id: 'usr_admin_001',
    email: 'admin@hbplus.fit',
    name: 'Sarah Connor (Security Admin)',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    role: 'admin',
    domain: 'hbplus.fit',
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'usr_member_002',
    email: 'alex.rivera@hbplus.fit',
    name: 'Alex Rivera (Staff)',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    role: 'user',
    domain: 'hbplus.fit',
    createdAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
];

class DatabaseService {
  /**
   * Retrieves all users from persistent storage
   */
  async getUsers(): Promise<User[]> {
    try {
      const raw = await getStorageItemAsync(STORAGE_KEYS.PERSISTENT_USERS);
      if (!raw) {
        // Initialize with seed users
        await this.saveUsers(INITIAL_SEED_USERS);
        return INITIAL_SEED_USERS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_SEED_USERS;
    }
  }

  private async saveUsers(users: User[]): Promise<void> {
    await setStorageItemAsync(
      STORAGE_KEYS.PERSISTENT_USERS,
      JSON.stringify(users)
    );
  }

  /**
   * Upserts a user upon successful authentication
   */
  async upsertUser(data: {
    email: string;
    name?: string;
    avatarUrl?: string;
    role?: UserRole;
  }): Promise<User> {
    const users = await this.getUsers();
    const normalizedEmail = data.email.toLowerCase().trim();
    const existingIndex = users.findIndex(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    const now = new Date().toISOString();
    const domain = extractDomain(normalizedEmail);
    const defaultRole: UserRole =
      data.role ||
      (ADMIN_EMAILS.includes(normalizedEmail) ? 'admin' : 'user');

    if (existingIndex >= 0) {
      const existing = users[existingIndex];
      const updatedUser: User = {
        ...existing,
        name: data.name || existing.name,
        avatarUrl: data.avatarUrl || existing.avatarUrl,
        lastLoginAt: now,
      };
      users[existingIndex] = updatedUser;
      await this.saveUsers(users);
      return updatedUser;
    }

    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: normalizedEmail,
      name: data.name || normalizedEmail.split('@')[0],
      avatarUrl:
        data.avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          data.name || normalizedEmail
        )}&background=0284c7&color=fff`,
      role: defaultRole,
      domain,
      createdAt: now,
      lastLoginAt: now,
    };

    users.push(newUser);
    await this.saveUsers(users);
    return newUser;
  }

  /**
   * Updates user role (admin capability)
   */
  async updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
    const users = await this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return false;
    user.role = newRole;
    await this.saveUsers(users);
    return true;
  }

  /**
   * Retrieves security audit logs
   */
  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const raw = await getStorageItemAsync(STORAGE_KEYS.AUDIT_LOGS);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  /**
   * Records a security audit log (allowed or restricted attempt)
   */
  async recordAuditLog(
    log: Omit<AuditLog, 'id' | 'timestamp' | 'platform'>
  ): Promise<AuditLog> {
    const logs = await this.getAuditLogs();
    const currentPlatform = Platform.OS === 'web' ? 'web' : Platform.OS === 'ios' ? 'ios' : 'android';
    const entry: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      platform: currentPlatform,
      ...log,
    };
    logs.unshift(entry);
    // Keep last 100 entries
    const trimmed = logs.slice(0, 100);
    await setStorageItemAsync(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(trimmed));
    return entry;
  }

  /**
   * Clear all audit logs
   */
  async clearAuditLogs(): Promise<void> {
    await setStorageItemAsync(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([]));
  }

  /**
   * Retrieves active allowed domains list
   */
  async getAllowedDomains(): Promise<string[]> {
    try {
      const raw = await getStorageItemAsync(STORAGE_KEYS.ALLOWED_DOMAINS);
      if (!raw) return [...DEFAULT_ALLOWED_DOMAINS];
      return JSON.parse(raw);
    } catch {
      return [...DEFAULT_ALLOWED_DOMAINS];
    }
  }

  /**
   * Adds a new allowed domain (admin action)
   */
  async addAllowedDomain(domain: string): Promise<string[]> {
    const clean = domain.toLowerCase().trim().replace(/^@/, '');
    const domains = await this.getAllowedDomains();
    if (!domains.includes(clean)) {
      domains.push(clean);
      await setStorageItemAsync(
        STORAGE_KEYS.ALLOWED_DOMAINS,
        JSON.stringify(domains)
      );
    }
    return domains;
  }

  /**
   * Removes an allowed domain (admin action)
   */
  async removeAllowedDomain(domain: string): Promise<string[]> {
    const clean = domain.toLowerCase().trim().replace(/^@/, '');
    let domains = await this.getAllowedDomains();
    domains = domains.filter((d) => d !== clean);
    // Always preserve default domain
    if (!domains.includes(DEFAULT_ALLOWED_DOMAINS[0])) {
      domains.push(DEFAULT_ALLOWED_DOMAINS[0]);
    }
    await setStorageItemAsync(
      STORAGE_KEYS.ALLOWED_DOMAINS,
      JSON.stringify(domains)
    );
    return domains;
  }
}

export const databaseService = new DatabaseService();
