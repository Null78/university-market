/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
    ],
  },
  env: {
    GITHUB_APP_CLIENT_ID: "919b87qa4sdfs1qdc44f53baf9",
    GITHUB_APP_CLIENT_SECRET: "2aeq98df3f8cwqerc2d03a8360e993c115ba8d5f71de9",
    NEXTAUTH_SECRET: "mQ46qpFwfE1BHuqMC+qlm19qBAD9fVPgh28werwe3ASFlAfnKjM=",
  },
};

export default nextConfig;
