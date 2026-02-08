import createBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

let createMDX: ((options?: Record<string, unknown>) => (config: NextConfig) => NextConfig) | undefined;
try {
  ({ createMDX } = await import('fumadocs-mdx/next'));
} catch {
  console.warn('[next.config] fumadocs-mdx/next not available, skipping MDX plugin');
}

const withAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const config: NextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  serverExternalPackages: [
    'ts-morph',
    'typescript',
    'oxc-transform',
    'twoslash',
    'shiki',
    '@takumi-rs/image-response',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/docs/:path*.mdx',
        destination: '/llms.mdx/:path*',
      },
      {
        source: '/docs.mdx',
        destination: '/llms.mdx',
      },
    ];
  },
};

const withMDX = createMDX?.();

export default withAnalyzer(withMDX ? withMDX(config) : config);
