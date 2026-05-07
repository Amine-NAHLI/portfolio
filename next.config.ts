import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  webpack: (config, { isServer, nextRuntime }) => {
    if (isServer) {
      config.module.rules.push({
        test: /html-context\.shared-runtime/,
        use: [{
          loader: 'string-replace-loader',
          options: {
            search: 'throw Object.defineProperty',
            replace: 'return;throw Object.defineProperty',
            flags: 'g'
          }
        }]
      });
    }
    return config;
},
};

export default nextConfig;