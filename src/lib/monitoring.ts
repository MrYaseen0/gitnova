export function captureError(error: Error, context?: Record<string, unknown>) {
  console.error('[GitNova Error]', error.message, context);
  // Sentry captures automatically in prod if initialized
}

export function captureMetric(name: string, value: number) {
  if (import.meta.env.PROD) {
    // Plausible custom events
    window.plausible?.('Custom Event', { props: { name, value } });
  }
}
