import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import manifestChrome from "./manifest.json";
import manifestFirefox from "./manifest_firefox.json";
import path, { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: process.env.BROWSER === "chrome"
    ? [react(), crx({ manifest: manifestChrome }), nodePolyfills()]
    : [react(), crx({ manifest: manifestFirefox }), nodePolyfills()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        popup: resolve(__dirname, "popup.html"),
        import: resolve(__dirname, "importpopup.html")
      },
    },
    outDir: path.join(__dirname, 'dist', process.env.BROWSER!),

  },
});
