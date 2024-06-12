import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";

const target = process.env.TARGET || "chrome";

function generateManifest() {
  const manifest = readJsonFile(`src/manifest.${target}.json`);
  const pkg = readJsonFile("package.json");
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: generateManifest,
      webExtConfig: {
        startUrl: "https://www.birdreport.cn",
      },
      additionalInputs: [
        "src/contents/index.html",
        "src/contents/request/index.ts",
      ],
    }),
  ],
});
