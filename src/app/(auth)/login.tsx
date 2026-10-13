import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import { useAuth } from '../../context/AuthContext';
import { GoogleSignInButton } from '../../components/ui/GoogleSignInButton';
import { AlertBanner } from '../../components/ui/AlertBanner';
import { Card } from '../../components/ui/Card';
import { DomainTestHarness } from '../../components/ui/DomainTestHarness';
import { GOOGLE_CONFIG, DEFAULT_ALLOWED_DOMAIN } from '../../utils/constants';
import { authService } from '../../services/authService';
import { useResponsive } from '../../hooks/useResponsive';

export default function LoginScreen() {
  const { signInWithGoogleProfile, isLoading, error, clearError } = useAuth();
  const { isMobile } = useResponsive();
  const [oauthLoading, setOauthLoading] = useState(false);

  // Setup Google OAuth Request via expo-auth-session
  const redirectUri = authService.getRedirectUri();

  const [, , promptAsync] = AuthSession.useAuthRequest(
    {
      clientId:
        Platform.OS === 'web'
          ? GOOGLE_CONFIG.webClientId
          : Platform.OS === 'ios'
          ? GOOGLE_CONFIG.iosClientId
          : GOOGLE_CONFIG.androidClientId,
      scopes: GOOGLE_CONFIG.scopes,
      redirectUri,
    },
    GOOGLE_CONFIG.discovery
  );

  const handleGoogleSignInPress = async () => {
    clearError();
    if (!promptAsync) return;

    setOauthLoading(true);
    try {
      const res = await promptAsync();
      if (res.type === 'success' && res.authentication?.accessToken) {
        const accessToken = res.authentication.accessToken;
        const profile = await authService.fetchGoogleUserInfo(accessToken);
        await signInWithGoogleProfile(profile, accessToken);
      }
    } catch (err: any) {
      console.warn('OAuth prompt notice:', err);
    } finally {
      setOauthLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isMobile && styles.scrollContentMobile,
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.centerWrapper, { maxWidth: 480 }]}>
          {/* Logo & Header */}
          <View style={styles.brandingHeader}>
            <View style={styles.logoBadge}>
              <Ionicons name="fitness" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.appTitle}>HB+ Enterprise Portal</Text>
            <Text style={styles.appSubtitle}>
              Secure Workplace Access & Analytics Platform
            </Text>
          </View>

          {/* Main Login Card */}
          <Card style={styles.card}>
            {/* Domain Security Policy Notice */}
            <View style={styles.policyNotice}>
              <Ionicons name="shield-checkmark" size={18} color="#0284C7" />
              <View style={styles.policyTextWrapper}>
                <Text style={styles.policyTitle}>Domain-Restricted Access</Text>
                <Text style={styles.policyBody}>
                  Access is exclusively limited to authorized accounts with email addresses
                  ending in{' '}
                  <Text style={styles.domainHighlight}>@{DEFAULT_ALLOWED_DOMAIN}</Text>.
                </Text>
              </View>
            </View>

            {/* Error Banner */}
            {error ? (
              <AlertBanner
                type="error"
                title="Authentication Denied"
                message={error}
                onDismiss={clearError}
              />
            ) : null}

            {/* Google Sign-In Action */}
            <View style={styles.actionContainer}>
              <Text style={styles.actionLabel}>Sign In With Work Account</Text>
              <GoogleSignInButton
                onPress={handleGoogleSignInPress}
                isLoading={isLoading || oauthLoading}
                disabled={isLoading || oauthLoading}
              />
              <Text style={styles.oauthHint}>
                Uses Google OAuth 2.0 PKCE protocol for authentication.
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>DEMO & EVALUATION</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Interactive Domain Test Harness */}
            <DomainTestHarness />
          </Card>

          {/* Security Footer */}
          <View style={styles.footer}>
            <View style={styles.footerRow}>
              <Ionicons name="lock-closed-outline" size={14} color="#94A3B8" />
              <Text style={styles.footerText}>
                Encrypted Session · Role-Based Access · Multi-Platform Support
              </Text>
            </View>
            <Text style={styles.copyrightText}>
              © 2026 HB+ Technology Inc. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  scrollContentMobile: {
    padding: 16,
    justifyContent: 'flex-start',
    paddingTop: 32,
  },
  centerWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  brandingHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  card: {
    width: '100%',
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  policyNotice: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 10,
    alignItems: 'flex-start',
  },
  policyTextWrapper: {
    flex: 1,
  },
  policyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0369A1',
    marginBottom: 2,
  },
  policyBody: {
    fontSize: 12,
    color: '#0284C7',
    lineHeight: 17,
  },
  domainHighlight: {
    fontWeight: '700',
    color: '#075985',
  },
  actionContainer: {
    marginBottom: 18,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 10,
  },
  oauthHint: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
    gap: 6,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    textAlign: 'center',
  },
  copyrightText: {
    fontSize: 11,
    color: '#CBD5E1',
  },
});
