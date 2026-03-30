import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.tsx"],
    server: {
      deps: {
        inline: ["@mui/x-data-grid"],
      },
    },
    testTimeout: 10000,
  },
});
