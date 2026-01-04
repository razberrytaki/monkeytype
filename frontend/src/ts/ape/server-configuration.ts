/**
 * @deprecated Server configuration removed in privacy fork
 * This file is a stub to prevent build errors.
 */

type ServerConfig = {
  results?: {
    limits?: {
      maxBatchSize: number;
    };
  };
  users?: {
    signUp: boolean;
    premium?: {
      enabled: boolean;
    };
  };
  connections?: {
    enabled: boolean;
  };
};

let config: ServerConfig | undefined = undefined;

const { promise: configurationPromise, resolve } = promiseWithResolvers<boolean>();

export { configurationPromise };

export function get(): ServerConfig | undefined {
  return config;
}

export async function sync(): Promise<void> {
  resolve(true);
}

function promiseWithResolvers<T>(): {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
} {
  let resolve: (value: T) => void;
  let reject: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}
