export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["vuetify-nuxt-module", "@nuxtjs/tailwindcss", "@pinia/nuxt"],
  runtimeConfig: {
    POSTGRES_URL: process.env.POSTGRES_URL,
  },
  app: {
    head: {
      bodyAttrs: {
        style: "background-color: #BAE6FD;",
      },
    },
  },
});
