import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import manifest from "./manifest.json";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest }), nodePolyfills()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        popup: resolve(__dirname, "popup.html"),
      },
    },
  },
});
