import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { advisorDevPlugin } from "./vite-plugin-advisor.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  if (env.ANTHROPIC_API_KEY) process.env.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;

  return {
  plugins: [react(), advisorDevPlugin()],
  optimizeDeps: {
    include: ["react-draggable"],
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
};
});
