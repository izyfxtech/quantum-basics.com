import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

const srcDir = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig(async ({ command }) => ({
  plugins: [
    tailwindcss(),
    tanstackStart({
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
    }),
    // Nitro only needs to run for the production build; TanStack Start's own
    // dev server handles local `vite dev` without it.
    ...(command === "build"
      ? [
          // No explicit preset: Nitro auto-detects the host from the build
          // environment (Vercel, Cloudflare, etc.) via NITRO_PRESET/provider
          // detection. Hardcoding a preset here overrides that detection.
          (await import("nitro/vite")).nitro(),
        ]
      : []),
    viteReact(),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: { "@": srcDir },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  server: {
    host: true,
    port: 8080,
  },
}));
