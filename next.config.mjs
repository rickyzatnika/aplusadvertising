/**** Next.js config in JS ****/
const nextConfig = {
  // Use memory cache to avoid Windows rename issues while keeping speed
  webpack: (config) => {
    config.cache = { type: 'memory' };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
