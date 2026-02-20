export const logger = {
  info: (...args: unknown[]) => console.info("[art]", ...args),
  warn: (...args: unknown[]) => console.warn("[art]", ...args),
  error: (...args: unknown[]) => console.error("[art]", ...args),
};
