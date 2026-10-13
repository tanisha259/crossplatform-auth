import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'admin' | 'user' | 'allowed' | 'restricted' | 'domain' | 'neutral';
  style?: StyleProp<ViewStyle>;
}

export function Badge({ label, variant = 'neutral', style }: BadgeProps) {
  const getStyles = () => {
    switch (variant) {
      case 'admin':
        return {
          bg: '#EDE9FE',
          text: '#6D28D9',
          border: '#DDD6FE',
        };
      case 'user':
        return {
          bg: '#E0F2FE',
          text: '#0369A1',
          border: '#BAE6FD',
        };
      case 'allowed':
        return {
          bg: '#DCFCE7',
          text: '#15803D',
          border: '#BBF7D0',
        };
      case 'restricted':
        return {
          bg: '#FEE2E2',
          text: '#B91C1C',
          border: '#FECACA',
        };
      case 'domain':
        return {
          bg: '#FEF3C7',
          text: '#B45309',
          border: '#FDE68A',
        };
      case 'neutral':
      default:
        return {
          bg: '#F1F5F9',
          text: '#475569',
          border: '#E2E8F0',
        };
    }
  };

  const scheme = getStyles();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: scheme.bg, borderColor: scheme.border },
        style,
      ]}
    >
      <Text style={[styles.text, { color: scheme.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
