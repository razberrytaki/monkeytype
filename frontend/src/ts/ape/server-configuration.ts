/**
 * @deprecated Server configuration removed in privacy fork
 * This file is a stub to prevent build errors.
 */

type ServerConfig = {
  results?: {
    limits?: {
      maxBatchSize?: number;
      regularUser?: number;
      premiumUser?: number;
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
    minUid: number;
  };
  leaderboards: {
    mode2time: number[];
    mode2words: number[];
    mode: "time" | "words";
    showAll: boolean;
    minTimeTyping?: number;
  };
  dailyLeaderboards: {
    rules: Array<{
      mode: string;
      mode2: string;
      languages?: string[];
    }>;
    validModeRules: Array<{
      mode: string;
      mode2: string;
      languages?: string[];
    }>;
  };
};

// oxlint-disable-next-line no-deprecated
const config: ServerConfig = {
  leaderboards: {
    mode2time: [15, 30, 60, 120],
    mode2words: [10, 25, 50, 100],
    mode: "time",
    showAll: false,
    minTimeTyping: 7200,
  },
  dailyLeaderboards: {
    rules: [
      { mode: "time", mode2: "15" },
      { mode: "time", mode2: "60" },
    ],
    validModeRules: [
      { mode: "time", mode2: "15" },
      { mode: "time", mode2: "60" },
    ],
  },
};

const { promise: configurationPromise, resolve } =
  promiseWithResolvers<boolean>();

export { configurationPromise };

// oxlint-disable-next-line no-deprecated
export function get(): ServerConfig {
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
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}
