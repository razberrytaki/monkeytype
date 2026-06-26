import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ["cjs", "esm"],
  external: ["zod", "@monkeytype/util"],
  dts: { entry: ["src/index.ts"] },
});
