import { PrismaInstrumentation } from "@prisma/instrumentation";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import * as Sentry from "@sentry/react-router";
function init() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    denyUrls: [
      /\/resources\/healthcheck/,
      // TODO: be smarter about the public assets...
      /\/build\//,
      /\/favicons\//,
      /\/img\//,
      /\/fonts\//,
      /\/favicon.ico/,
      /\/site\.webmanifest/
    ],
    integrations: [
      Sentry.prismaIntegration({
        prismaInstrumentation: new PrismaInstrumentation()
      }),
      Sentry.httpIntegration(),
      nodeProfilingIntegration()
    ],
    tracesSampler(samplingContext) {
      if (samplingContext.request?.url?.includes("/resources/healthcheck")) {
        return 0;
      }
      return process.env.NODE_ENV === "production" ? 1 : 0;
    },
    beforeSendTransaction(event) {
      if (event.request?.headers?.["x-healthcheck"] === "true") {
        return null;
      }
      return event;
    }
  });
}
export {
  init
};
//# sourceMappingURL=monitoring.js.map
