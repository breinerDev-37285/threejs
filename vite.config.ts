import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

const src = resolve(__dirname, "src", "app");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@hooks": resolve(src, "hooks"),
      "@scenes": resolve(src, "scenes"),
      "@interfaces": resolve(src, "interfaces"),
      "@models": resolve(src, "models"),
      "@controls": resolve(src, "controls"),
      "@helpers": resolve(src, "helpers"),
    },
  },
});
