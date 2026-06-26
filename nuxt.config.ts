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
        style: "background-color: #2F4F4F;",
      },
    },
  },
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: "customTheme",
        themes: {
          customTheme: {
            dark: true,
            colors: {
              primary: "#05ad70",
              error: "#DCDCDC",
            },
          },
        },
      },
    },
  },
});
