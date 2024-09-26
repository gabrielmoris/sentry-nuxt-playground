// server/api/sentry-proxy.ts
import { defineEventHandler, readBody } from "h3";
import * as Sentry from "@sentry/node";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

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
  console.log("Validating event", event);
  // Implement validation logic here.
  return event;
}
