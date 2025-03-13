/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "ipfs.io",
      "gateway.ipfs.io",
      "ipfs.infura.io",
      "nftstorage.link",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
