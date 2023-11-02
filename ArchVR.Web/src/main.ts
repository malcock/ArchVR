import { ViteSSG } from "vite-ssg";
// import { createApp } from 'vue'
import "./style.css";
import "dropzone/dist/basic.css";
import "dropzone/dist/dropzone.css";
import { createPinia } from "pinia";
import App from "./App.vue";
import generatedRoutes from "~pages";
import { setupLayouts } from "virtual:generated-layouts";

// import ApiServices from "./store/ApiService";

const routes = setupLayouts(generatedRoutes);

export const createApp = ViteSSG(
  App,
  { routes },
  async ({
    app,
    router,
    routes,
    isClient,
    initialState,
    routePath,
    onSSRAppRendered,
  }) => {
    const pinia = createPinia();
    // pinia.use(ApiServices);
    app.use(pinia);

    if (isClient) {
      pinia.state.value = initialState.pinia || {};
    } else {
      initialState.pinia = pinia.state.value;

      onSSRAppRendered(async () => {
        initialState.pinia = pinia.state.value;
      });
    }

    // router.beforeEach(async (to, from, next) => {
    //   await authStore
    //     .refresh()
    //     .then(async () => {
    //       await organisationStore.getOrganisations();
    //     })
    //     .catch(() => {
    //       //on error return to homepage
    //       router.push("/");
    //       next("/");
    //     });
    //   next();
    // });
  }
);

// createApp(App).mount('#app')

// import { createApp } from 'vue'
// import './style.css'
// import App from './App.vue'

// createApp(App).mount('#app')
