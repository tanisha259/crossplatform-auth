import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Page Not Found' }} />
      <View style={styles.container}>
        <Ionicons name="compass-outline" size={54} color="#94A3B8" />
        <Text style={styles.title}>This screen does not exist.</Text>
        <Text style={styles.sub}>
          The link you visited could not be located in HB+ Portal.
        </Text>
        <Link href="/(app)/" style={styles.link}>
          <Text style={styles.linkText}>Return to Dashboard</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F8FAFC',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  sub: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  link: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#0284C7',
  },
  linkText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
