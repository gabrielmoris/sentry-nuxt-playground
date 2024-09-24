import * as Sentry from "@sentry/nuxt";
const config = useRuntimeConfig();
Sentry.init({
  dsn: config.public.sentryDNS as string,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration(),
    Sentry.replayCanvasIntegration({ enableManualSnapshot: true }),
  ],
  tracesSampleRate: 1.0,
});
