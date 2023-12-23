import path from "path";
import { envConfig } from "./src/envConfig";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "src",
  devtools: { enabled: true },
  build: {
    transpile: ["trpc-nuxt"],
  },
  modules: ["@sidebase/nuxt-auth", "@nuxtjs/tailwindcss", "nuxt-primevue"],
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
  primevue: {
    options: {
      unstyled: true,
    },
    importPT: { from: "primevue/passthrough/tailwind", as: "Tailwind" },
    cssLayerOrder: "tailwind-base, primevue, tailwind-utilities",
  },
});
