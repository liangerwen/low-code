import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vitePluginForArco from "@arco-plugins/vite-react";
import Unocss from "unocss/vite";
import { presetUno, presetIcons } from "unocss";
import commpressPlugin from "vite-plugin-compression";
import monacoEditorPlugin from "vite-plugin-monaco-editor";
import { createHtmlPlugin } from "vite-plugin-html";
import { viteExternalsPlugin } from "vite-plugin-externals";
import injectExternals from "vite-plugin-inject-externals";

const externalModules = [
  {
    name: "react",
    global: "React",
    path: "https://unpkg.com/react@18.2.0/umd/react.production.min.js",
  },
  {
    name: "react-dom",
    global: "ReactDOM",
    path: "https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js",
  },
  {
    name: "history",
    global: "HistoryLibrary",
    path: "https://unpkg.com/history@5.3.0/umd/history.production.min.js",
  },
  {
    name: "react-router",
    global: "ReactRouter",
    path: "https://unpkg.com/react-router@6.3.0/umd/react-router.production.min.js",
  },
  {
    name: "react-router-dom",
    global: "ReactRouterDOM",
    path: "https://unpkg.com/react-router-dom@6.3.0/umd/react-router-dom.production.min.js",
  },
  {
    name: "@arco-design/web-react",
    global: "arco",
    path: "https://unpkg.com/@arco-design/web-react@2.39.2/dist/arco.min.js",
  },
  {
    name: "@arco-design/web-react/icon",
    global: "arcoicon",
    path: "https://unpkg.com/@arco-design/web-react@2.39.2/dist/arco-icon.min.js",
  },
  {
    name: "less",
    global: "less",
    path: "https://unpkg.com/less@4.1.3/dist/less.min.js",
  },
  {
    name: "axios",
    global: "axios",
    path: "https://unpkg.com/axios@0.27.2/dist/axios.min.js",
  },
];

const monacoCDN = {
  "monaco-editor": "monaco",
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  const externalPlugins = isDev
    ? []
    : [
        viteExternalsPlugin({
          ...externalModules.reduce(
            (pre, cur) => ((pre[cur.name] = cur.global), pre),
            {}
          ),
          ...monacoCDN,
        }),
        injectExternals({
          modules: externalModules,
        }),
      ];

  const htmlOptions = isDev
    ? {
        minify: false,
        inject: {
          data: {
            monaco: "",
          },
        },
      }
    : {
        inject: {
          data: {
            monaco: `<link data-name="vs/editor/editor.main" rel="stylesheet" href="https://unpkg.com/monaco-editor@0.34.0/min/vs/editor/editor.main.css">
      <script>var require = { paths: { vs: 'https://unpkg.com/monaco-editor@0.34.0/min/vs' } };</script>
      <script src="https://unpkg.com/monaco-editor@0.34.0/min/vs/loader.js"></script>
      <script src="https://unpkg.com/monaco-editor@0.34.0/min/vs/editor/editor.main.js"></script>`,
          },
        },
      };
  return {
    plugins: [
      react(),
      vitePluginForArco(),
      monacoEditorPlugin({
        languageWorkers: ["editorWorkerService", "typescript", "json", "css"],
      }),
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
            /^frosted-glass-wrapper-\[(.+)\]$/,
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
      createHtmlPlugin(htmlOptions),
      ...externalPlugins,
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
        external: externalModules
          .map((em) => em.name)
          .concat(Object.keys(monacoCDN)),
      },
    },
  };
});
