import { extendConfig } from "@monkeytype/tsup-config";

export default extendConfig((options) => {
  const entry = [
    "src/index.ts",
    "src/util/api.ts",
    "src/require-configuration/index.ts",
    "src/rate-limit/index.ts",
  ];
  return {
    ...options,
    entry,
    dts: {
      entry,
      tsconfig: {
        compilerOptions: {
          skipLibCheck: true,
        },
      },
    },
  };
});
