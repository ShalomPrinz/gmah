import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~bootstrap": resolve(__dirname, "node_modules/bootstrap"),
    },
  },
  build: {
    outDir: "./static",
  },
  server: {
    host: true,
    port: 3000,
  },
});
