import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { databaseService } from '../../services/databaseService';
import { AuditLog } from '../../types';
import { useResponsive } from '../../hooks/useResponsive';

export function SecurityAuditLog() {
  const { isMobile } = useResponsive();
  const [logs, setLogs] = useState<AuditLog[]>([]);

  const fetchLogs = async () => {
    const all = await databaseService.getAuditLogs();
    setLogs(all);
  };

  useEffect(() => {
    let isMounted = true;
    databaseService.getAuditLogs().then((all) => {
      if (isMounted) {
        setLogs(all);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleClear = async () => {
    await databaseService.clearAuditLogs();
    await fetchLogs();
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return (
        d.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
        ' ' +
        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    } catch {
      return iso;
    }
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.titleRow}>
            <Ionicons name="finger-print-outline" size={20} color="#0284C7" />
            <Text style={styles.title}>Real-time Security Audit Trail</Text>
          </View>
          <Text style={styles.description}>
            Log of all authentication requests, domain evaluations, and access decisions.
          </Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={fetchLogs}
            accessibilityLabel="Refresh logs"
          >
            <Ionicons name="refresh" size={16} color="#64748B" />
          </TouchableOpacity>
          {logs.length > 0 && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.clearBtn]}
              onPress={handleClear}
              accessibilityLabel="Clear logs"
            >
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {logs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="shield-checkmark" size={36} color="#10B981" />
          <Text style={styles.emptyTitle}>No authentication attempts recorded yet</Text>
          <Text style={styles.emptySub}>
            New login attempts (authorized or restricted) will appear here instantly.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {logs.map((log) => (
            <View key={log.id} style={[styles.item, isMobile && styles.itemMobile]}>
              <View style={styles.itemMain}>
                <View style={styles.statusRow}>
                  <Badge
                    label={log.status}
                    variant={log.status === 'allowed' ? 'allowed' : 'restricted'}
                  />
                  <Text style={styles.emailText} numberOfLines={1}>
                    {log.email}
                  </Text>
                </View>

                {log.reason ? (
                  <Text style={styles.reasonText} numberOfLines={2}>
                    {log.reason}
                  </Text>
                ) : null}
              </View>

              <View style={[styles.itemMeta, isMobile && styles.itemMetaMobile]}>
                <View style={styles.platformBadge}>
                  <Text style={styles.platformText}>{log.platform.toUpperCase()}</Text>
                </View>
                <Text style={styles.timeText}>{formatDate(log.timestamp)}</Text>
              </View>
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtn: {
    backgroundColor: '#FEF2F2',
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
  description: {
    fontSize: 13,
    color: '#64748B',
  },
  list: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 16,
  },
  itemMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
  },
  itemMain: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  reasonText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  itemMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  itemMetaMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  platformBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  platformText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  timeText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
});
