import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vitePluginForArco from "@arco-plugins/vite-react";
import Unocss from "unocss/vite";
import { presetUno, presetIcons } from "unocss";
import commpressPlugin from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePluginForArco(),
    Unocss({
      presets: [
        presetUno(),
        presetIcons({
          extraProperties: {
            display: "inline-block",
            "vertical-align": "middle",
          },
        }),
      ],
      rules: [
        [
          /^frosted-glass-warpper-\[(.+)\]$/,
          ([, d]) => ({
            position: "relative",
            overflow: "hidden",
            background: d,
            "box-shadow": "3px 3px 6px 3px rgba(0, 0, 0, 0.3)",
          }),
        ],
        [
          /^frosted-glass-mask-\[(.+)\]$/,
          ([, d]) => ({
            content: "",
            background: d,
            "background-attachment": "fixed",
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            filter: "blur(8px)",
            margin: "-30px",
          }),
        ],
        [
          "titillium",
          {
            "font-family":
              "Titillium Web, PingFang SC, Hiragino Sans GB, 'Microsoft YaHei',Helvetica Neue, Helvetica, Arial, sans-serif !important",
          },
        ],
      ],
    }),
    commpressPlugin({
      verbose: true, // 默认即可
      disable: false, //开启压缩(不禁用)，默认即可
      deleteOriginFile: false, //删除源文件
      threshold: 10240, //压缩前最小文件大小
      algorithm: "gzip", //压缩算法
      ext: ".gz", //文件类型
    }),
  ],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  esbuild: {
    minify: true,
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
  },
});
