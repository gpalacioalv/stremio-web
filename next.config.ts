import type { NextConfig } from "next";
import { execSync } from "child_process";

const getGitCommitHash = () => {
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch (e) {
    console.warn("Could not get git commit hash, using fallback 'unknown'.");
    return "unknown";
  }
};

const nextConfig: NextConfig = {
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.NEXT_PUBLIC_GIT_COMMIT_SHA": JSON.stringify(
          getGitCommitHash()
        ),
      })
    );

    if (process.env.NODE_ENV === "development") {
      config.module.rules.push({
        test: /\.(jsx|tsx)$/,
        exclude: /node_modules/,
        enforce: "pre",
        use: "@dyad-sh/nextjs-webpack-component-tagger",
      });
    }
    return config;
  },
};

export default nextConfig;