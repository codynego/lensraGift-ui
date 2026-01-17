/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',  // Enforce HTTPS for security
        hostname: 'res.cloudinary.com',
        pathname: '/**',  // Allow all paths under this hostname
      },
    ],
  },
};

module.exports = nextConfig;