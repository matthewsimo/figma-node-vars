import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import { viteSingleFile } from "vite-plugin-singlefile";

import { exec } from "child_process";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  return {
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          exportType: "default",
        },
      }),
      viteSingleFile(),
      {
        name: "post-build-command",
        closeBundle: async () => {
          console.log("Update manifest.json");
          // exec(
          //   "cat manifest.json > temp.json && cat temp.json > manifest.json && rm temp.json"
          // );
        },
      },
    ],
    build: {
      outDir: "dist/ui",
      target: "es2020",
      minify: !isDev,
      watch: isDev ? {} : null,
      sourcemap: isDev,
      cssCodeSplit: false,
      assetsInlineLimit: 100000000,
      rollupOptions: {
        output: {},
      },
    },
  };
});
