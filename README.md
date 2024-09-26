[Sentry Nuxt Documentation](https://docs.sentry.io/platforms/javascript/guides/nuxt/)

# Sentry PRoxy

**Lösung 1 Intelligent Error Grouping**

Sentry kann ähnliche Fehler mit einem einfachen Skript gruppieren:

```javascript
Sentry.init({
  beforeSend(event) {
    // Custom fingerprinting
    event.fingerprint = ["{{ default }}", event.exception.values[0].type];
    return event;
  },
});
```

Sentry kann auch die console logs/errors auch lesen und filtern:

```javascript
 Sentry.init({
	dsn: config.public.sentryDNS as string,
	integrations: [
	    Sentry.replayIntegration(),  // Aufnahme
	    Sentry.replayCanvasIntegration({ enableManualSnapshot: true }),
	    Sentry.captureConsoleIntegration(),  // Alle Logs
	],
	ignoreErrors: [ // Logs dass wurde filtern
    "<Suspense> is an experimental feature and its API will likely change.",
	],
	 })
```

**Lösung 2 Self-hosted sentry**  
Wir können unser eigenes sentry haben:
https://develop.sentry.dev/self-hosted/

**Lösung 3 Proxy**  
Sentry hat auch die möglichkheit um die Fehler durch ein Proxy zu schicken um es zu bearbeiten / filtern:

```typescript
// sentry.client.config.ts

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
    Sentry.captureConsoleIntegration(), // Sentry.browserTracingIntegration(), // More Info about browser, I dont think this is necessary
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
    }).catch(console.error); // Prevent sending to Sentry directly
    return null;
  },
});
```

Ein Beinspiel mit ein Api route in nuxt /server

```typescript
// server/api/sentry-proxy.ts

import { defineEventHandler, readBody } from "h3";
import * as Sentry from "@sentry/node";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig(); // I Initialize again sentry
  Sentry.init({
    dsn: config.public.sentryDNS,
  });

  if (validateSentryEvent(body)) {
    // Forward the event to Sentry as-is
    Sentry.captureEvent(body);
    return { status: "success", message: "Event forwarded to Sentry" };
  } else {
    return { status: "error", message: "Invalid event data" };
  }
});

function validateSentryEvent(event: any) {
  console.log("Validating event", event); // Implement any validation logic here.
  return event; // Null or falsy valye= I dont send
}
```

# Nuxt docs

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
