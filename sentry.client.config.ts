// Info about Nuxt Integration (is not same as vue) https://docs.sentry.io/platforms/javascript/guides/nuxt/
import * as Sentry from "@sentry/nuxt";
const config = useRuntimeConfig();
Sentry.init({
  dsn: config.public.sentryDNS as string,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration(),
    Sentry.replayCanvasIntegration({ enableManualSnapshot: true }),
    Sentry.captureConsoleIntegration(),
    // Sentry.browserTracingIntegration(), // More Info about browser, I dont think this is necessary
  ],
  tracesSampleRate: 1.0,
  ignoreErrors: [
    "<Suspense> is an experimental feature and its API will likely change.",
    "✨ %cNuxt DevTools %c Press Shift + Alt + D to open DevTools color: black; border-radius: 3px 0 0 3px; padding: 2px 2px 1px 10px; background: #00DC82 border-radius: 0 3px 3px 0; padding: 2px 10px 1px 2px; background: #00DC8220 ",
  ],
  beforeSend(event, hint) {
    // Send to our proxy instead of sending directly to Sentry. I use the nuxt server but It can be a external server
    fetch("/api/sentry-proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    }).catch(console.error);

    // Prevent sending to Sentry directly
    return null;
  },
});
