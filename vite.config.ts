import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backend = env.VITE_BACKEND_URL || "http://localhost:8000";
  return {
    plugins: [react()],
    resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "next/image": path.resolve(__dirname, "src/shims/next-image.tsx"),
      "next/link": path.resolve(__dirname, "src/shims/next-link.tsx"),
      "next/navigation": path.resolve(
        __dirname,
        "src/shims/next-navigation.ts"
      ),
      "next/font/google": path.resolve(
        __dirname,
        "src/shims/next-font-google.ts"
      ),
      },
    },
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: backend,
          changeOrigin: true,
        },
      },
    },
  };
});


