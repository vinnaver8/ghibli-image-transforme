/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/ghibli-image-transforme',
  assetPrefix: '/ghibli-image-transforme',
};

export default nextConfig;
