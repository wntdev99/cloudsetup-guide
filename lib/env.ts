/**
 * Environment variables validation and type-safe access
 * This file validates required environment variables at startup
 */

function validateEnv() {
  const requiredEnvs = ['NEXT_PUBLIC_SITE_URL'] as const;

  const missing = requiredEnvs.filter(
    (envKey) => !process.env[envKey] || process.env[envKey]?.trim() === ''
  );

  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables:\n` +
        missing.map((key) => `  - ${key}`).join('\n') +
        `\n\n` +
        `Please check .env.example and create .env.local with the required values.`
    );
  }

  // Validate SITE_URL format
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  try {
    new URL(siteUrl);
  } catch {
    throw new Error(
      `❌ Invalid NEXT_PUBLIC_SITE_URL: "${siteUrl}"\n` +
        `Must be a valid URL (e.g., https://cloudsetup.guide)`
    );
  }

  // Warn about localhost in production
  if (process.env.NODE_ENV === 'production' && siteUrl.includes('localhost')) {
    console.warn(
      `⚠️  WARNING: NEXT_PUBLIC_SITE_URL is set to localhost in production mode.\n` +
        `   SEO and social sharing features may not work correctly.`
    );
  }
}

// Run validation (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
  validateEnv();
}

// Export type-safe environment variables
export const env = {
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL!,
  GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  ADSENSE_ID: process.env.NEXT_PUBLIC_ADSENSE_ID,
} as const;

// Type for environment variables
export type Env = typeof env;
