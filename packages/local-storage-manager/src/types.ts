import { z } from "zod";

export const StorageKey = {
  SETTINGS: "mt_settings",
  HISTORY: "mt_history",
  PERSONAL_BEST: "mt_personal_best",
  TAGS: "mt_tags",
  VERSION: "mt_version",
} as const;

export type StorageKeyType = typeof StorageKey;

export const StorageVersion = 1;

export const TypedResultSchema = z.object({
  id: z.string(),
  wpm: z.number(),
  acc: z.number(),
  mode: z.string(),
  mode2: z.string(),
  timestamp: z.number(),
  testDuration: z.number(),
  characters: z.number(),
  consistency: z.number(),
  rawWpm: z.number(),
});

export type TypedResult = z.infer<typeof TypedResultSchema>;

export const TagDataSchema = z.object({
  name: z.string(),
  stats: z.object({
    time: z.number().optional(),
    tests: z.number().optional(),
    wpm10: z.number().optional(),
    wpm60: z.number().optional(),
  }),
});

export type TagData = z.infer<typeof TagDataSchema>;

export const StorageDataSchema = z.object({
  settings: z.unknown(),
  history: z.array(TypedResultSchema),
  personalBest: z.record(z.number()),
  tags: z.record(TagDataSchema),
});

export type StorageData = z.infer<typeof StorageDataSchema>;

export type StorageError = Error & {
  code: "QUOTA_EXCEEDED" | "NOT_AVAILABLE" | "WRITE_FAILED" | "READ_FAILED";
};

export function createStorageError(
  code: StorageError["code"],
  message: string
): StorageError {
  const error = new Error(message) as StorageError;
  (error as StorageError).code = code;
  error.name = "StorageError";
  return error;
}

export function isStorageError(error: unknown): error is StorageError {
  return (
    error instanceof Error &&
    (error as StorageError).code !== undefined &&
    Object.values([
      "QUOTA_EXCEEDED",
      "NOT_AVAILABLE",
      "WRITE_FAILED",
      "READ_FAILED",
    ]).includes((error as StorageError).code)
  );
}
