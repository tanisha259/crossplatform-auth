import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { databaseService } from '../../services/databaseService';
import { AuditLog } from '../../types';
import { useAuth } from '../../context/AuthContext';

export function RecentActivity() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    let mounted = true;
    databaseService.getAuditLogs().then((all) => {
      if (mounted) {
        // Filter or display recent attempts
        const userLogs = all.filter(
          (l) => l.email.toLowerCase() === user?.email.toLowerCase()
        );
        setLogs(userLogs.slice(0, 5));
      }
    });
    return () => {
      mounted = false;
    };
  }, [user]);

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + d.toLocaleDateString();
    } catch {
      return iso;
    }
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="time-outline" size={20} color="#0284C7" />
          <Text style={styles.title}>Your Recent Activity & Access Logs</Text>
        </View>
        <Text style={styles.subtitle}>
          Continuous domain validation history for {user?.email}
        </Text>
      </View>

      {logs.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-done-circle-outline" size={32} color="#10B981" />
          <Text style={styles.emptyText}>Current session verified</Text>
          <Text style={styles.emptySubtext}>
            Logged in via @{user?.domain || 'hbplus.fit'} official account
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {logs.map((log) => (
            <View key={log.id} style={styles.item}>
              <View style={styles.itemLeft}>
                <View
                  style={[
                    styles.iconBox,
                    log.status === 'allowed'
                      ? styles.iconBoxAllowed
                      : styles.iconBoxRestricted,
                  ]}
                >
                  <Ionicons
                    name={
                      log.status === 'allowed'
                        ? 'shield-checkmark'
                        : 'shield-outline'
                    }
                    size={16}
                    color={log.status === 'allowed' ? '#10B981' : '#EF4444'}
                  />
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemReason}>
                    {log.reason || 'Authentication Event'}
                  </Text>
                  <Text style={styles.itemMeta}>
                    Platform: {log.platform.toUpperCase()} · {formatDate(log.timestamp)}
                  </Text>
                </View>
              </View>
              <Badge
                label={log.status}
                variant={log.status === 'allowed' ? 'allowed' : 'restricted'}
              />
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  list: {
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxAllowed: {
    backgroundColor: '#ECFDF5',
  },
  iconBoxRestricted: {
    backgroundColor: '#FEF2F2',
  },
  itemDetails: {
    flex: 1,
  },
  itemReason: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  itemMeta: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 6,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  emptySubtext: {
    fontSize: 12,
    color: '#64748B',
  },
});
