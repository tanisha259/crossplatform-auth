import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { StatsOverview } from '../../components/dashboard/StatsOverview';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { useResponsive } from '../../hooks/useResponsive';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const { isMobile, contentMaxWidth } = useResponsive();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.scrollContent,
        isMobile && styles.scrollContentMobile,
      ]}
    >
      <View style={[styles.innerContainer, { maxWidth: contentMaxWidth }]}>
        {/* Welcome Banner */}
        <View style={styles.welcomeBanner}>
          <View style={styles.welcomeTextGroup}>
            <View style={styles.badgeRow}>
              <Badge
                label={`@${user?.domain || 'hbplus.fit'}`}
                variant="domain"
              />
              <Badge
                label={user?.role === 'admin' ? 'Security Admin' : 'Authorized Member'}
                variant={user?.role === 'admin' ? 'admin' : 'user'}
              />
            </View>
            <Text style={styles.welcomeTitle}>
              Welcome back, {user?.name || 'Team Member'} 👋
            </Text>
            <Text style={styles.welcomeSubtitle}>
              Signed in as <Text style={styles.boldEmail}>{user?.email}</Text>. Your session is
              verified by enterprise domain policies.
            </Text>
          </View>

          {isAdmin && (
            <TouchableOpacity
              style={styles.adminCta}
              onPress={() => router.push('/(app)/admin')}
              activeOpacity={0.8}
            >
              <Ionicons name="settings-outline" size={16} color="#FFFFFF" />
              <Text style={styles.adminCtaText}>Admin Console</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Security & System Stats Overview */}
        <StatsOverview />

        {/* Quick Actions Shortcuts */}
        <QuickActions />

        {/* User Activity & Access Logs */}
        <RecentActivity />

        {/* Corporate Workplace Information Card */}
        <Card style={styles.infoCard}>
          <View style={styles.infoTitleRow}>
            <Ionicons name="information-circle-outline" size={20} color="#0284C7" />
            <Text style={styles.infoTitle}>Workplace Security Standard</Text>
          </View>
          <Text style={styles.infoParagraph}>
            All organizational resources within HB+ Portal require authenticated access
            originating strictly from verified <Text style={styles.boldDomain}>@hbplus.fit</Text> Google
            accounts. OAuth 2.0 PKCE tokens and refresh tokens are encrypted on the device using
            hardware-backed secure storage.
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  scrollContentMobile: {
    padding: 16,
  },
  innerContainer: {
    width: '100%',
  },
  welcomeBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  welcomeTextGroup: {
    flex: 1,
    minWidth: 260,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  boldEmail: {
    fontWeight: '600',
    color: '#0284C7',
  },
  adminCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 6,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  adminCtaText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoCard: {
    padding: 20,
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  infoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0369A1',
  },
  infoParagraph: {
    fontSize: 13,
    color: '#0284C7',
    lineHeight: 19,
  },
  boldDomain: {
    fontWeight: '700',
    color: '#075985',
  },
});
