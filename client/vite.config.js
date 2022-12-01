import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "./assets"),
    },
  },
  plugins: [react()],
  css: {
    modules: {
      scopeBehaviour: "local",
      localsConvention: "camelCaseOnly",
      generateScopedName: "[name]__[local]__[hash:base64:5]",
    },
  },
});
