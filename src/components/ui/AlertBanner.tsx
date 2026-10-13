import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AlertBannerProps {
  type?: 'error' | 'success' | 'warning' | 'info';
  title?: string;
  message: string;
  onDismiss?: () => void;
}

export function AlertBanner({
  type = 'error',
  title,
  message,
  onDismiss,
}: AlertBannerProps) {
  if (!message) return null;

  const getColors = () => {
    switch (type) {
      case 'error':
        return {
          bg: '#FEF2F2',
          border: '#F87171',
          text: '#991B1B',
          icon: '#DC2626',
          iconName: 'alert-circle' as const,
        };
      case 'success':
        return {
          bg: '#ECFDF5',
          border: '#6EE7B7',
          text: '#065F46',
          icon: '#059669',
          iconName: 'checkmark-circle' as const,
        };
      case 'warning':
        return {
          bg: '#FFFBEB',
          border: '#FCD34D',
          text: '#92400E',
          icon: '#D97706',
          iconName: 'warning' as const,
        };
      case 'info':
      default:
        return {
          bg: '#EFF6FF',
          border: '#93C5FD',
          text: '#1E40AF',
          icon: '#2563EB',
          iconName: 'information-circle' as const,
        };
    }
  };

  const colors = getColors();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.bg, borderColor: colors.border },
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={colors.iconName} size={22} color={colors.icon} />
      </View>
      <View style={styles.textContainer}>
        {title ? (
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        ) : null}
        <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
      </View>
      {onDismiss ? (
        <TouchableOpacity
          onPress={onDismiss}
          style={styles.closeBtn}
          accessibilityLabel="Dismiss error"
        >
          <Ionicons name="close" size={18} color={colors.text} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginVertical: 10,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 1,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  closeBtn: {
    padding: 4,
    marginLeft: 8,
  },
});
