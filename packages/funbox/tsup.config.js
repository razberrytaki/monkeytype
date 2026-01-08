import { extendConfig } from "@monkeytype/tsup-config";

export default extendConfig(() => ({
  entry: ["src/index.ts"],
  dts: { entry: ["src/index.ts"] },
}));
