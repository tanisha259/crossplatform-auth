import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from './Badge';
import { Button } from './Button';
import { useAuth } from '../../context/AuthContext';

export function DomainTestHarness() {
  const { loginWithTestAccount, isLoading } = useAuth();
  const [customEmail, setCustomEmail] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const testCases = [
    {
      label: 'Authorized Staff',
      email: 'alex.rivera@hbplus.fit',
      expected: 'allowed' as const,
      description: 'Official enterprise domain (Member role)',
    },
    {
      label: 'Security Admin',
      email: 'admin@hbplus.fit',
      expected: 'allowed' as const,
      description: 'Official enterprise domain (Admin role)',
    },
    {
      label: 'Restricted Gmail',
      email: 'example@gmail.com',
      expected: 'restricted' as const,
      description: 'Triggers domain restriction rejection',
    },
    {
      label: 'External Domain',
      email: 'candidate@yahoo.com',
      expected: 'restricted' as const,
      description: 'Blocked non-enterprise email',
    },
  ];

  const handleTestClick = (email: string) => {
    loginWithTestAccount(email);
  };

  const handleCustomTest = () => {
    if (!customEmail.trim()) return;
    loginWithTestAccount(customEmail.trim());
  };

  return (
    <View style={styles.container}>
      {/* Header toggle */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View style={styles.flaskIcon}>
            <Ionicons name="flask-outline" size={16} color="#0284C7" />
          </View>
          <View>
            <Text style={styles.title}>Domain Verification Test Suite</Text>
            <Text style={styles.subtitle}>
              Test allowed vs restricted domains with 1-click presets
            </Text>
          </View>
        </View>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="#64748B"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          <Text style={styles.instruction}>
            Click any preset below to simulate a Google OAuth response for that identity:
          </Text>

          {/* Test Case Cards */}
          <View style={styles.grid}>
            {testCases.map((tc, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.testCard,
                  tc.expected === 'allowed'
                    ? styles.testCardAllowed
                    : styles.testCardRestricted,
                ]}
                onPress={() => handleTestClick(tc.email)}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <View style={styles.cardTop}>
                  <Text style={styles.cardLabel}>{tc.label}</Text>
                  <Badge
                    label={tc.expected}
                    variant={tc.expected === 'allowed' ? 'allowed' : 'restricted'}
                  />
                </View>

                <Text style={styles.emailCode} numberOfLines={1}>
                  {tc.email}
                </Text>

                <Text style={styles.cardDesc} numberOfLines={1}>
                  {tc.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Email Input */}
          <View style={styles.customContainer}>
            <Text style={styles.customLabel}>Or test custom email:</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="name@anydomain.com"
                placeholderTextColor="#94A3B8"
                value={customEmail}
                onChangeText={setCustomEmail}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Button
                title="Test Domain"
                size="sm"
                variant="outline"
                onPress={handleCustomTest}
                disabled={!customEmail.trim() || isLoading}
                isLoading={isLoading}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginTop: 20,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  flaskIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  content: {
    padding: 14,
  },
  instruction: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 10,
  },
  grid: {
    gap: 8,
    marginBottom: 14,
  },
  testCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  testCardAllowed: {
    borderColor: '#BBF7D0',
  },
  testCardRestricted: {
    borderColor: '#FECACA',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  emailCode: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#0284C7',
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 11,
    color: '#64748B',
  },
  customContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
  },
  customLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 13,
    color: '#0F172A',
  },
});
