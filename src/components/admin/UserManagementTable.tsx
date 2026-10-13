import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { databaseService } from '../../services/databaseService';
import { User, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useResponsive } from '../../hooks/useResponsive';

export function UserManagementTable() {
  const { user: currentUser, refreshUser } = useAuth();
  const { isMobile } = useResponsive();
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const allUsers = await databaseService.getUsers();
    setUsers(allUsers);
  };

  useEffect(() => {
    let isMounted = true;
    databaseService.getUsers().then((allUsers) => {
      if (isMounted) {
        setUsers(allUsers);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleRole = async (targetUser: User) => {
    if (targetUser.id === currentUser?.id) {
      Alert.alert('Notice', 'You cannot change your own administrator status.');
      return;
    }

    const newRole: UserRole = targetUser.role === 'admin' ? 'user' : 'admin';
    await databaseService.updateUserRole(targetUser.id, newRole);
    await fetchUsers();
    await refreshUser();
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="people-outline" size={20} color="#0284C7" />
          <Text style={styles.title}>Enterprise User Directory & Roles</Text>
        </View>
        <Text style={styles.description}>
          All verified users stored in the database. Administrators can promote or demote accounts.
        </Text>
      </View>

      <View style={styles.table}>
        {users.map((usr) => (
          <View key={usr.id} style={[styles.row, isMobile && styles.rowMobile]}>
            {/* User Profile */}
            <View style={styles.profileCell}>
              {usr.avatarUrl ? (
                <Image source={{ uri: usr.avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarInitial}>
                    {(usr.name || usr.email)[0].toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={styles.nameBlock}>
                <View style={styles.nameRow}>
                  <Text style={styles.nameText} numberOfLines={1}>
                    {usr.name}
                  </Text>
                  {usr.id === currentUser?.id ? (
                    <Text style={styles.youIndicator}>(You)</Text>
                  ) : null}
                </View>
                <Text style={styles.emailText} numberOfLines={1}>
                  {usr.email}
                </Text>
              </View>
            </View>

            {/* Role & Toggle */}
            <View style={[styles.metaCell, isMobile && styles.metaCellMobile]}>
              <View style={styles.dateBlock}>
                <Text style={styles.dateLabel}>Last Active</Text>
                <Text style={styles.dateValue}>{formatDate(usr.lastLoginAt)}</Text>
              </View>

              <Badge
                label={usr.role}
                variant={usr.role === 'admin' ? 'admin' : 'user'}
              />

              {usr.id !== currentUser?.id && (
                <TouchableOpacity
                  style={[
                    styles.roleToggleBtn,
                    usr.role === 'admin' ? styles.demoteBtn : styles.promoteBtn,
                  ]}
                  onPress={() => handleToggleRole(usr)}
                >
                  <Ionicons
                    name={
                      usr.role === 'admin'
                        ? 'arrow-down-circle-outline'
                        : 'arrow-up-circle-outline'
                    }
                    size={14}
                    color={usr.role === 'admin' ? '#D97706' : '#6366F1'}
                  />
                  <Text
                    style={[
                      styles.roleToggleText,
                      { color: usr.role === 'admin' ? '#D97706' : '#6366F1' },
                    ]}
                  >
                    {usr.role === 'admin' ? 'Make Member' : 'Make Admin'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
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
  description: {
    fontSize: 13,
    color: '#64748B',
  },
  table: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  rowMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
  },
  profileCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  nameBlock: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  youIndicator: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '600',
  },
  emailText: {
    fontSize: 12,
    color: '#64748B',
  },
  metaCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaCellMobile: {
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: 48,
  },
  dateBlock: {
    alignItems: 'flex-end',
  },
  dateLabel: {
    fontSize: 10,
    color: '#94A3B8',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  dateValue: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  roleToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  promoteBtn: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  demoteBtn: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  roleToggleText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
