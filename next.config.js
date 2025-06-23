// let userConfig = undefined
// try {
//   // try to import ESM first
//   userConfig = await import('./v0-user-next.config.mjs')
// } catch (e) {
//   try {
//     // fallback to CJS import
//     userConfig = await import("./v0-user-next.config");
//   } catch (innerError) {
//     // ignore error
//   }
// }

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     unoptimized: true,
//   },
//   experimental: {
//     webpackBuildWorker: true,
//     parallelServerBuildTraces: true,
//     parallelServerCompiles: true,
//   },
// }

// if (userConfig) {
//   // ESM imports will have a "default" property
//   const config = userConfig.default || userConfig

//   for (const key in config) {
//     if (
//       typeof nextConfig[key] === 'object' &&
//       !Array.isArray(nextConfig[key])
//     ) {
//       nextConfig[key] = {
//         ...nextConfig[key],
//         ...config[key],
//       }
//     } else {
//       nextConfig[key] = config[key]
//     }
//   }
// }

// export default nextConfig

const path = require("path");

let userConfig = {};
try {
  userConfig = require("./v0-user-next.config.js");
} catch (e) {
  // fallback failed or not found
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname);
    return config;
  },
};

// Merge user config if exists
if (userConfig) {
  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === "object" &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      };
    } else {
      nextConfig[key] = userConfig[key];
    }
  }
}

module.exports = nextConfig;
