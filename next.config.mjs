/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_SECRET: process.env.API_SECRET,
  }
};

export default nextConfig;