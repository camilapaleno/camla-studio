/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
      unoptimized: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    webpack(config) {
      config.module.rules.push({
        test: /\.webm$/,
        type: 'asset/resource',
      });
      return config;
    },
  };

  export default nextConfig;