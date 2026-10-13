import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { Session, User } from '../types';
import { GOOGLE_CONFIG, RESTRICTED_ERROR_MESSAGE } from '../utils/constants';
import { validateEmailForLogin } from '../utils/domainValidator';
import { databaseService } from './databaseService';

// Ensure browser redirects close properly on web
WebBrowser.maybeCompleteAuthSession();

export interface GoogleUserProfile {
  id: string;
  email: string;
  verified_email?: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  hd?: string; // Hosted domain in Google Workspace (e.g., hbplus.fit)
}

export interface LoginResult {
  success: boolean;
  user?: User;
  session?: Session;
  error?: string;
}

class AuthService {
  /**
   * Get redirect URI for current platform
   */
  getRedirectUri(): string {
    return AuthSession.makeRedirectUri({
      scheme: 'hbplus-auth',
      preferLocalhost: true,
    });
  }

  /**
   * Process and validate user login payload from any Google source (OAuth response or verified token)
   */
  async processGoogleUserLogin(
    profile: GoogleUserProfile,
    token: string = 'token_' + Math.random().toString(36).substring(2)
  ): Promise<LoginResult> {
    const allowedDomains = await databaseService.getAllowedDomains();
    const validation = validateEmailForLogin(profile.email, allowedDomains);

    if (!validation.isValid) {
      // Record failed security attempt
      await databaseService.recordAuditLog({
        email: profile.email,
        status: 'restricted',
        reason: `Domain rejection: @${validation.domain || 'unknown'} is not authorized. Allowed: ${allowedDomains.join(', ')}`,
      });

      return {
        success: false,
        error: validation.error || RESTRICTED_ERROR_MESSAGE,
      };
    }

    // Domain is valid! Upsert user in database
    const user = await databaseService.upsertUser({
      email: profile.email,
      name: profile.name || profile.email.split('@')[0],
      avatarUrl: profile.picture,
    });

    // Record successful login audit
    await databaseService.recordAuditLog({
      email: profile.email,
      status: 'allowed',
      reason: `Successfully authenticated via Google OAuth (Domain: @${user.domain})`,
    });

    const session: Session = {
      user,
      token,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    return {
      success: true,
      user,
      session,
    };
  }

  /**
   * Fetches user profile from Google UserInfo endpoint using access token
   */
  async fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserProfile> {
    const response = await fetch(GOOGLE_CONFIG.discovery.userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Google UserInfo API error: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Direct test login handler to simulate/demonstrate domain verification behavior
   * (e.g. testing alex@hbplus.fit vs example@gmail.com without requiring external Google credentials)
   */
  async simulateGoogleLogin(testEmail: string, customName?: string): Promise<LoginResult> {
    const name =
      customName ||
      testEmail
        .split('@')[0]
        .split('.')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

    const fakeGoogleProfile: GoogleUserProfile = {
      id: `g_${Math.random().toString(36).substring(2, 10)}`,
      email: testEmail.trim(),
      name,
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=${testEmail.endsWith('hbplus.fit') ? '0284c7' : 'dc2626'}&color=fff`,
    };

    return await this.processGoogleUserLogin(
      fakeGoogleProfile,
      `mock_google_oauth_token_${Date.now()}`
    );
  }
}

export const authService = new AuthService();
