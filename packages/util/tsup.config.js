import { extendConfig } from "@monkeytype/tsup-config";

export default extendConfig((options) => {
  const entry = [
    "src/arrays.ts",
    "src/date-and-time.ts",
    "src/json.ts",
    "src/numbers.ts",
    "src/predicates.ts",
    "src/strings.ts",
    "src/trycatch.ts",
    "src/zod.ts",
  ];
  return {
    ...options,
    entry,
    dts: { entry },
  };
});
