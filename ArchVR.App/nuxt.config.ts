import { envConfig } from "./src/envConfig";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "src",
  devtools: { enabled: true },
  modules: ["@sidebase/nuxt-auth", "@nuxtjs/tailwindcss"],
  auth: {
    baseURL: envConfig.AUTH_ORIGIN,
    provider: {
      type: "authjs",
    },
  },
});
