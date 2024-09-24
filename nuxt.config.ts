// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@sentry/nuxt/module"],
  runtimeConfig: {
    public: {
      sentryDNS: process.env.SENTRY_DSN,
    },
  },
  sentry: {
    sourceMapsUploadOptions: {
      org: "gabrielcmoris",
      project: "sentry-nuxt-playground",
      authToken: process.env.SENTRY_AUTH,
    },
  },
});
