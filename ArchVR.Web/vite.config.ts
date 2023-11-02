import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Pages from "vite-plugin-pages";
import Components from "unplugin-vue-components/vite";

import mkcert from "vite-plugin-mkcert";
// import generateSitemap from "vite-plugin-pages-sitemap";
import dotenv from "dotenv";
import Layouts from "vite-plugin-vue-layouts";

const renderedRoutes = [];
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  dotenv.config({ path: `./.env.${mode}` });

  return {
    define: {
      "process.env": { ...process.env, APP_MODE: mode },
    },
    build: {
      cssCodeSplit: false,
    },
    server: {
      https: true,
      port: mode === "development" ? 3000 : null,
    },
    plugins: [
      mkcert(),
      vue(),
      Components(),
      Pages(),
      Layouts(),
      //htmlConfig(htmlConfigOptions)
    ],
    ssgOptions: {
      dirStyle: "nested",
      format: "cjs",

      // mock: mode !== "production",
      // script: "async",
      onPageRendered(route, indexHTML, appCtx) {
        renderedRoutes.push(route);
      },
      onFinished() {
        console.log("finished!", renderedRoutes);
        // generateSitemap({
        //   routes: renderedRoutes,
        //   hostname: "https://3dviewpro.com",
        //   allowRobots: true,
        //   dest: "dist",
        // });
      },
    },
  };
});
