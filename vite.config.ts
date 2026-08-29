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
  build: {
    rollupOptions: {
      output: {
        // Previously everything (React, the router, Supabase, framer-motion,
        // icons) landed in one ~500KB chunk shared by every route. Splitting
        // vendor code out by library means a dependency bump only
        // invalidates the browser cache for that one chunk, not the whole
        // app, and lets the browser fetch independent vendor chunks in
        // parallel instead of one large blocking file. This only changes
        // which physical file bytes land in, not what runs or when it's
        // requested — see the note in src/routes/__root.tsx about a
        // separate, riskier optimization (lazy-loading the marketing chrome
        // itself) that this deliberately does not attempt.
        manualChunks(id: string) {
          if (!id.includes("node_modules")) return undefined;
          if (/[\\/]react(-dom)?[\\/]|\/scheduler\//.test(id)) return "vendor-react";
          if (id.includes("@tanstack/react-router") || id.includes("@tanstack/router-core")) {
            return "vendor-router";
          }
          if (id.includes("@supabase")) return "vendor-supabase";
          if (id.includes("framer-motion") || id.includes("/motion/")) return "vendor-motion";
          if (id.includes("lucide-react")) return "vendor-icons";
          return undefined;
        },
      },
    },
  },
  server: {
    host: true,
    port: 8080,
  },
}));
