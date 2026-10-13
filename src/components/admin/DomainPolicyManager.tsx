import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { databaseService } from '../../services/databaseService';
import { useAuth } from '../../context/AuthContext';
import { DEFAULT_ALLOWED_DOMAIN } from '../../utils/constants';

export function DomainPolicyManager() {
  const { allowedDomains, refreshDomains } = useAuth();
  const [newDomain, setNewDomain] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAddDomain = async () => {
    if (!newDomain.trim()) return;
    const clean = newDomain.trim().toLowerCase().replace(/^@/, '');
    if (allowedDomains.includes(clean)) {
      setFeedback(`Domain @${clean} is already in the allowed list.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await databaseService.addAllowedDomain(clean);
      await refreshDomains();
      setNewDomain('');
      setFeedback(`Successfully added @${clean} to allowed domains.`);
    } catch {
      setFeedback('Failed to add domain.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveDomain = async (domainToRemove: string) => {
    if (domainToRemove === DEFAULT_ALLOWED_DOMAIN) {
      Alert.alert(
        'Protected Domain',
        `The primary domain @${DEFAULT_ALLOWED_DOMAIN} cannot be removed as it is the core enterprise domain.`
      );
      return;
    }

    try {
      await databaseService.removeAllowedDomain(domainToRemove);
      await refreshDomains();
      setFeedback(`Removed @${domainToRemove} from allowed domains.`);
    } catch {
      setFeedback('Failed to remove domain.');
    }
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="shield-outline" size={20} color="#0284C7" />
          <Text style={styles.title}>Allowed Email Domain Rules</Text>
        </View>
        <Text style={styles.description}>
          Users attempting to authenticate through Google OAuth must possess an email
          ending in one of these domains. All other domains are immediately rejected.
        </Text>
      </View>

      {/* Domain List */}
      <View style={styles.domainChipsContainer}>
        {allowedDomains.map((dom) => (
          <View key={dom} style={styles.domainChip}>
            <Ionicons name="at" size={14} color="#0369A1" />
            <Text style={styles.domainName}>{dom}</Text>
            {dom === DEFAULT_ALLOWED_DOMAIN ? (
              <Badge label="PRIMARY" variant="allowed" style={styles.primaryBadge} />
            ) : (
              <TouchableOpacity
                onPress={() => handleRemoveDomain(dom)}
                style={styles.removeBtn}
                accessibilityLabel={`Remove ${dom}`}
              >
                <Ionicons name="close-circle" size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* Add New Domain Input */}
      <View style={styles.inputRow}>
        <View style={styles.inputWrapper}>
          <Text style={styles.atSymbol}>@</Text>
          <TextInput
            style={styles.input}
            value={newDomain}
            onChangeText={(text) => {
              setNewDomain(text);
              setFeedback(null);
            }}
            placeholder="e.g. partners.hbplus.fit"
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <Button
          title="Add Domain"
          onPress={handleAddDomain}
          size="sm"
          isLoading={isSubmitting}
          disabled={!newDomain.trim()}
          style={styles.addBtn}
        />
      </View>

      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
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
    lineHeight: 18,
  },
  domainChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  domainChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 6,
  },
  domainName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0369A1',
  },
  primaryBadge: {
    paddingVertical: 1,
    paddingHorizontal: 5,
  },
  removeBtn: {
    padding: 2,
    marginLeft: 2,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  atSymbol: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '700',
    marginRight: 4,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  addBtn: {
    minWidth: 110,
  },
  feedback: {
    fontSize: 12,
    color: '#0284C7',
    marginTop: 8,
    fontWeight: '500',
  },
});
