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
    //This is not necessary since I am proxying the errors
    // sourceMapsUploadOptions: {
    //   org: "gabrielcmoris",
    //   project: "nuxt-sentry-learn",
    //   authToken: process.env.SENTRY_AUTH,
    // },
  },
});
