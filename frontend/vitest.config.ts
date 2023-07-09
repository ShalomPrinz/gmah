import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    reporters: ["default"],
    coverage: {
      provider: "v8",
      reporter: ["html"],
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "~bootstrap": resolve(__dirname, "node_modules/bootstrap"),
    },
  },
});
