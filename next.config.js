/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'fmnyrfsgzpypwrfuamhh.supabase.co', // Your exact Supabase project URL
        pathname: '/storage/v1/object/public/**', // Allows access to your public storage buckets
      }
    ],
  },
};

export default nextConfig;