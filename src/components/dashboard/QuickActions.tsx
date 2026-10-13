import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useResponsive } from '../../hooks/useResponsive';

export function QuickActions() {
  const router = useRouter();
  const { user, isAdmin, signOut } = useAuth();
  const { isMobile } = useResponsive();

  const actions = [
    {
      title: 'Admin Governance',
      description: isAdmin
        ? 'Manage allowed domains, review audit logs, and configure user roles.'
        : 'Restricted to administrators. View permission requirements.',
      icon: 'shield-half-outline',
      color: '#6366F1',
      bg: '#EEF2FF',
      onPress: () => router.push('/(app)/admin'),
    },
    {
      title: 'Domain Policies',
      description: `Active policy enforces @${user?.domain || 'hbplus.fit'} exclusively.`,
      icon: 'business-outline',
      color: '#0284C7',
      bg: '#E0F2FE',
      onPress: () => router.push('/(app)/admin'),
    },
    {
      title: 'Security Sign Out',
      description: 'Terminates active session tokens and clears device storage.',
      icon: 'log-out-outline',
      color: '#EF4444',
      bg: '#FEF2F2',
      onPress: signOut,
    },
  ];

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      {actions.map((act, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.touchable, isMobile && styles.touchableMobile]}
          onPress={act.onPress}
          activeOpacity={0.8}
        >
          <Card style={styles.card}>
            <View style={[styles.iconWrapper, { backgroundColor: act.bg }]}>
              <Ionicons name={act.icon as any} size={22} color={act.color} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{act.title}</Text>
              <Text style={styles.description}>{act.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  containerMobile: {
    flexDirection: 'column',
    gap: 12,
  },
  touchable: {
    flex: 1,
  },
  touchableMobile: {
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
});
