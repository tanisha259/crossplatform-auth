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
import { Button } from '../../components/ui/Button';
import { DomainPolicyManager } from '../../components/admin/DomainPolicyManager';
import { UserManagementTable } from '../../components/admin/UserManagementTable';
import { SecurityAuditLog } from '../../components/admin/SecurityAuditLog';
import { databaseService } from '../../services/databaseService';
import { useResponsive } from '../../hooks/useResponsive';

export default function AdminScreen() {
  const router = useRouter();
  const { user, isAdmin, refreshUser } = useAuth();
  const { isMobile, contentMaxWidth } = useResponsive();

  const handleElevateRole = async () => {
    if (!user) return;
    await databaseService.updateUserRole(user.id, 'admin');
    await refreshUser();
  };

  const handleDemoteRole = async () => {
    if (!user) return;
    await databaseService.updateUserRole(user.id, 'user');
    await refreshUser();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.scrollContent,
        isMobile && styles.scrollContentMobile,
      ]}
    >
      <View style={[styles.innerContainer, { maxWidth: contentMaxWidth }]}>
        {/* Navigation Breadcrumb */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/(app)/')}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={16} color="#0284C7" />
          <Text style={styles.backButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>

        {/* Admin Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Enterprise Governance & Security</Text>
              <Badge
                label={user?.role === 'admin' ? 'Admin Access' : 'Read Only'}
                variant={user?.role === 'admin' ? 'admin' : 'neutral'}
              />
            </View>
            <Text style={styles.subtitle}>
              Configure domain policies, manage team member permissions, and inspect
              real-time security logs.
            </Text>
          </View>

          {/* Quick Role Switcher for Demo testing */}
          <View style={styles.roleSwitcherBox}>
            <Text style={styles.switcherLabel}>Demo Role Switcher:</Text>
            {isAdmin ? (
              <Button
                title="Switch to Member Role"
                size="sm"
                variant="outline"
                onPress={handleDemoteRole}
              />
            ) : (
              <Button
                title="Elevate to Admin"
                size="sm"
                variant="primary"
                onPress={handleElevateRole}
              />
            )}
          </View>
        </View>

        {/* If user is not admin, show permission notice */}
        {!isAdmin ? (
          <Card style={styles.permissionCard}>
            <View style={styles.permissionHeader}>
              <Ionicons name="lock-closed" size={24} color="#D97706" />
              <View style={styles.permissionTextGroup}>
                <Text style={styles.permissionTitle}>
                  Restricted Administrator Controls
                </Text>
                <Text style={styles.permissionBody}>
                  You are currently logged in with standard{' '}
                  <Text style={styles.bold}>Member</Text> privileges. Modifying domain
                  whitelists and promoting accounts requires{' '}
                  <Text style={styles.bold}>Admin</Text> authorization.
                </Text>
              </View>
            </View>
            <View style={styles.permissionAction}>
              <Button
                title="Grant Admin Rights (Test Mode)"
                size="sm"
                variant="primary"
                onPress={handleElevateRole}
              />
            </View>
          </Card>
        ) : null}

        {/* 1. Domain Policy Management */}
        <DomainPolicyManager />

        {/* 2. Registered Users & Role-Based Access Table */}
        <UserManagementTable />

        {/* 3. Security Audit Logs */}
        <SecurityAuditLog />
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0284C7',
  },
  header: {
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
  },
  headerLeft: {
    flex: 1,
    minWidth: 260,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  roleSwitcherBox: {
    alignItems: 'flex-end',
    gap: 6,
  },
  switcherLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  permissionCard: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
    marginBottom: 24,
    padding: 18,
  },
  permissionHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  permissionTextGroup: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 2,
  },
  permissionBody: {
    fontSize: 13,
    color: '#B45309',
    lineHeight: 18,
  },
  bold: {
    fontWeight: '700',
  },
  permissionAction: {
    alignSelf: 'flex-start',
    paddingLeft: 36,
  },
});
