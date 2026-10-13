export const DEFAULT_ALLOWED_DOMAIN = 'hbplus.fit';

export const DEFAULT_ALLOWED_DOMAINS: string[] = ['hbplus.fit'];

export const RESTRICTED_ERROR_MESSAGE =
  'Access restricted. Please login using your official domain email.';

export const ADMIN_EMAILS: string[] = [
  'admin@hbplus.fit',
  'security@hbplus.fit',
  'lead@hbplus.fit',
];

export const STORAGE_KEYS = {
  SESSION: 'hbplus_auth_session',
  AUDIT_LOGS: 'hbplus_audit_logs',
  ALLOWED_DOMAINS: 'hbplus_allowed_domains',
  PERSISTENT_USERS: 'hbplus_users_db',
} as const;

// Environment variable overrides with fallbacks
export const GOOGLE_CONFIG = {
  clientId:
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
    '1029384756-demo-client-id.apps.googleusercontent.com',
  webClientId:
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
    '1029384756-demo-web.apps.googleusercontent.com',
  iosClientId:
    process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ||
    '1029384756-demo-ios.apps.googleusercontent.com',
  androidClientId:
    process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
    '1029384756-demo-android.apps.googleusercontent.com',
  discovery: {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
    userInfoEndpoint: 'https://www.googleapis.com/oauth2/v3/userinfo',
  },
  scopes: ['openid', 'profile', 'email'],
};

export const SUPABASE_CONFIG = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hbplus-fit-demo.supabase.co',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key-placeholder',
};
