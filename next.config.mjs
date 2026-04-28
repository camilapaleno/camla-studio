/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Required for static export
    images: {
      unoptimized: true, // Disable Image Optimization API for static export
    },
    eslint: {
      ignoreDuringBuilds: true, // Disable ESLint during build for production
    },
  };

  export default nextConfig;