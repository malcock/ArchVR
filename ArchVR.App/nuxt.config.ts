import { envConfig } from "./src/envConfig";
import { fileURLToPath } from "url";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  alias: {
    "~archvr3d": fileURLToPath(new URL("../ArchVR.3D", import.meta.url)),
  },
  srcDir: "src",
  css: ["~/assets/css/icons.css"],
  devtools: { enabled: true },
  build: {
    transpile: ["trpc-nuxt", "echarts"],
  },
  modules: [
    "@sidebase/nuxt-auth",
    "@nuxtjs/tailwindcss",
    "@vee-validate/nuxt",
    "@vueuse/nuxt",
    "@pinia/nuxt",
  ],
  auth: {
    baseURL: envConfig.AUTH_ORIGIN,
    provider: {
      type: "authjs",
    },
    globalAppMiddleware: {
      isEnabled: true,
    },
  },
  tailwindcss: {},
  vite: {
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    },
  },
});
