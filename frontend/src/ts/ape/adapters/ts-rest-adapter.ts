import type { AppRouter, InitClientArgs, InitClientReturn } from "@ts-rest/core";

/**
 * Privacy fork: the real ts-rest fetch adapter is removed so frontend Ape calls
 * cannot perform backend network requests. This helper is kept only for the
 * compile-time client shape used by frontend/src/ts/ape/index.ts.
 */
export let lastSeenServerCompatibility: number | undefined;

export function buildClient<T extends AppRouter>(
  _contract: T,
  _baseUrl: string,
  _timeout: number = 10_000,
): InitClientReturn<T, InitClientArgs> {
  throw new Error("Backend API adapter removed in privacy fork");
}
