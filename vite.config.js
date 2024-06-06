import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import manifest from "./manifest.json";

export default defineConfig({
  plugins: [crx({ manifest }), nodePolyfills()],
});
