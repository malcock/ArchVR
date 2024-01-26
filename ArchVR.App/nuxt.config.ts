import path from "path";
import { envConfig } from "./src/envConfig";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "src",
  css: ["~/assets/css/icons.css"],
  devtools: { enabled: true },
  build: {
    transpile: ["trpc-nuxt"],
  },
  modules: ["@sidebase/nuxt-auth", "@nuxtjs/tailwindcss", "@vee-validate/nuxt"],
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
});
