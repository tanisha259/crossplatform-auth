import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useResponsive } from '../../hooks/useResponsive';

export function StatsOverview() {
  const { user } = useAuth();
  const { isMobile } = useResponsive();

  const stats = [
    {
      title: 'Domain Status',
      value: `@${user?.domain || 'hbplus.fit'}`,
      subtitle: 'Verified Enterprise Domain',
      icon: 'shield-checkmark',
      iconColor: '#10B981',
      bgColor: '#ECFDF5',
    },
    {
      title: 'Access Level',
      value: user?.role === 'admin' ? 'Security Admin' : 'Authorized Member',
      subtitle: user?.role === 'admin' ? 'Full administrative rights' : 'Standard workspace access',
      icon: user?.role === 'admin' ? 'key' : 'person',
      iconColor: '#6366F1',
      bgColor: '#EEF2FF',
    },
    {
      title: 'Authentication',
      value: 'Google OAuth 2.0',
      subtitle: 'PKCE & Secure Token Storage',
      icon: 'lock-closed',
      iconColor: '#0284C7',
      bgColor: '#E0F2FE',
    },
    {
      title: 'Session Status',
      value: 'Secure & Active',
      subtitle: 'Session verified across devices',
      icon: 'checkmark-circle',
      iconColor: '#F59E0B',
      bgColor: '#FEF3C7',
    },
  ];

  return (
    <View style={[styles.grid, isMobile && styles.gridMobile]}>
      {stats.map((stat, idx) => (
        <Card key={idx} style={[styles.card, isMobile && styles.cardMobile]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: stat.bgColor }]}>
              <Ionicons
                name={stat.icon as any}
                size={20}
                color={stat.iconColor}
              />
            </View>
            <Text style={styles.statTitle}>{stat.title}</Text>
          </View>
          <Text style={styles.statValue} numberOfLines={1}>
            {stat.value}
          </Text>
          <Text style={styles.statSubtitle} numberOfLines={1}>
            {stat.subtitle}
          </Text>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  gridMobile: {
    flexDirection: 'column',
    gap: 12,
  },
  card: {
    flex: 1,
    minWidth: 220,
    padding: 18,
  },
  cardMobile: {
    width: '100%',
    minWidth: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
