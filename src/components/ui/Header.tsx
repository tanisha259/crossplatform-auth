import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Badge } from './Badge';
import { useResponsive } from '../../hooks/useResponsive';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut, isAdmin } = useAuth();
  const { isMobile } = useResponsive();

  if (!user) return null;

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.container}>
        {/* Brand / Logo */}
        <TouchableOpacity
          style={styles.brand}
          onPress={() => router.push('/(app)/')}
          activeOpacity={0.8}
        >
          <View style={styles.logoIcon}>
            <Ionicons name="fitness" size={20} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.brandTitle}>HB+ Portal</Text>
            <Text style={styles.brandSubtitle}>Official Workplace</Text>
          </View>
        </TouchableOpacity>

        {/* Navigation Tabs (Desktop & Tablet) */}
        {!isMobile && (
          <View style={styles.navLinks}>
            <TouchableOpacity
              style={[
                styles.navItem,
                (pathname === '/' || pathname === '/(app)' || pathname === '/(app)/') &&
                  styles.navItemActive,
              ]}
              onPress={() => router.push('/(app)/')}
            >
              <Ionicons
                name="grid-outline"
                size={16}
                color={
                  pathname === '/' || pathname === '/(app)' || pathname === '/(app)/'
                    ? '#0284C7'
                    : '#64748B'
                }
              />
              <Text
                style={[
                  styles.navText,
                  (pathname === '/' || pathname === '/(app)' || pathname === '/(app)/') &&
                    styles.navTextActive,
                ]}
              >
                Dashboard
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navItem,
                pathname.includes('/admin') && styles.navItemActive,
              ]}
              onPress={() => router.push('/(app)/admin')}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={16}
                color={pathname.includes('/admin') ? '#0284C7' : '#64748B'}
              />
              <Text
                style={[
                  styles.navText,
                  pathname.includes('/admin') && styles.navTextActive,
                ]}
              >
                Admin Console
              </Text>
              {isAdmin ? (
                <Badge label="PRO" variant="admin" style={styles.navBadge} />
              ) : null}
            </TouchableOpacity>
          </View>
        )}

        {/* User Info & Logout */}
        <View style={styles.rightSection}>
          <View style={styles.userProfile}>
            {user.avatarUrl ? (
              <Image
                source={{ uri: user.avatarUrl }}
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitial}>
                  {(user.name || user.email)[0].toUpperCase()}
                </Text>
              </View>
            )}

            {!isMobile && (
              <View style={styles.userDetails}>
                <View style={styles.userNameRow}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {user.name}
                  </Text>
                  <Badge
                    label={user.role}
                    variant={user.role === 'admin' ? 'admin' : 'user'}
                    style={styles.roleBadge}
                  />
                </View>
                <Text style={styles.userEmail} numberOfLines={1}>
                  {user.email}
                </Text>
              </View>
            )}
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={signOut}
            accessibilityLabel="Sign out"
            accessibilityRole="button"
          >
            <Ionicons name="log-out-outline" size={18} color="#EF4444" />
            {!isMobile && <Text style={styles.logoutText}>Sign Out</Text>}
          </TouchableOpacity>
        </View>
      </View>

      {/* Mobile Sub-Navigation Bar */}
      {isMobile && (
        <View style={styles.mobileNavBar}>
          <TouchableOpacity
            style={[
              styles.mobileNavItem,
              (pathname === '/' || pathname === '/(app)' || pathname === '/(app)/') &&
                styles.mobileNavActive,
            ]}
            onPress={() => router.push('/(app)/')}
          >
            <Ionicons
              name="grid-outline"
              size={16}
              color={
                pathname === '/' || pathname === '/(app)' || pathname === '/(app)/'
                  ? '#0284C7'
                  : '#64748B'
              }
            />
            <Text
              style={[
                styles.mobileNavText,
                (pathname === '/' || pathname === '/(app)' || pathname === '/(app)/') &&
                  styles.mobileNavTextActive,
              ]}
            >
              Dashboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.mobileNavItem,
              pathname.includes('/admin') && styles.mobileNavActive,
            ]}
            onPress={() => router.push('/(app)/admin')}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color={pathname.includes('/admin') ? '#0284C7' : '#64748B'}
            />
            <Text
              style={[
                styles.mobileNavText,
                pathname.includes('/admin') && styles.mobileNavTextActive,
              ]}
            >
              Admin Console
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 6,
  },
  navItemActive: {
    backgroundColor: '#E0F2FE',
  },
  navText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  navTextActive: {
    color: '#0284C7',
  },
  navBadge: {
    marginLeft: 4,
    paddingVertical: 1,
    paddingHorizontal: 5,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  avatarPlaceholder: {
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  userDetails: {
    maxWidth: 160,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    flexShrink: 1,
  },
  roleBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  userEmail: {
    fontSize: 11,
    color: '#64748B',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
  },
  mobileNavBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'space-around',
  },
  mobileNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  mobileNavActive: {
    backgroundColor: '#E0F2FE',
  },
  mobileNavText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  mobileNavTextActive: {
    color: '#0284C7',
  },
});
