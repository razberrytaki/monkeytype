import { extendConfig } from "@monkeytype/tsup-config";
import { globSync } from "glob";

export default extendConfig((options) => {
  const entry = globSync("src/*.ts", { cwd: __dirname });
  return {
    ...options,
    entry,
    dts: { entry },
  };
});
