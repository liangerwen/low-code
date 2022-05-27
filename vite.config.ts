import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vitePluginForArco from "@arco-plugins/vite-react";
import Unocss from "unocss/vite";
import { presetUno, presetIcons } from "unocss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePluginForArco(),
    Unocss({
      presets: [presetUno(), presetIcons()],
      rules: [[/^min-h-(\w+)$/, ([, d]) => ({ "min-height": d })]],
    }),
  ],
});
