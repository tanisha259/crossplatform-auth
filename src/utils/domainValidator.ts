import { DEFAULT_ALLOWED_DOMAINS, RESTRICTED_ERROR_MESSAGE } from './constants';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  domain?: string;
  sanitizedEmail?: string;
}

/**
 * Extracts and normalizes the domain from an email address.
 * Example: 'User@HBPLUS.FIT' -> 'hbplus.fit'
 */
export function extractDomain(email: string): string {
  if (!email || typeof email !== 'string') return '';
  const trimmed = email.trim().toLowerCase();
  const atIndex = trimmed.lastIndexOf('@');
  if (atIndex === -1 || atIndex === trimmed.length - 1) return '';
  return trimmed.slice(atIndex + 1);
}

/**
 * Validates whether an email belongs to an allowed domain list.
 * Supports exact domain match as well as subdomains if configured.
 */
export function isValidDomain(
  email: string,
  allowedDomains: string[] = DEFAULT_ALLOWED_DOMAINS
): boolean {
  const domain = extractDomain(email);
  if (!domain) return false;

  const normalizedAllowed = allowedDomains.map((d) =>
    d.toLowerCase().trim().replace(/^@/, '')
  );

  return normalizedAllowed.some((allowed) => {
    return domain === allowed || domain.endsWith(`.${allowed}`);
  });
}

/**
 * Comprehensive email validator for the login pipeline.
 * Returns standard error message if domain is unauthorized.
 */
export function validateEmailForLogin(
  email: string,
  allowedDomains: string[] = DEFAULT_ALLOWED_DOMAINS
): ValidationResult {
  if (!email || typeof email !== 'string' || !email.trim()) {
    return {
      isValid: false,
      error: 'Please enter a valid email address.',
    };
  }

  const sanitized = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return {
      isValid: false,
      error: 'Invalid email address format.',
    };
  }

  const domain = extractDomain(sanitized);

  if (!isValidDomain(sanitized, allowedDomains)) {
    return {
      isValid: false,
      error: RESTRICTED_ERROR_MESSAGE,
      domain,
      sanitizedEmail: sanitized,
    };
  }

  return {
    isValid: true,
    domain,
    sanitizedEmail: sanitized,
  };
}
