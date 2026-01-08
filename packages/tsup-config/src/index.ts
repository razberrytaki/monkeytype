import { defineConfig, Options } from "tsup";
import { globSync } from "glob";

export function extendConfig(
  customizer?: (options: Options) => Options,
  // tsup uses MaybePromise which is not exported
  // oxlint-disable-next-line no-explicit-any
): (options: Options) => any {
  return (options) => {
    const overrideOptions = customizer?.(options);
    const entry = globSync("src/*.ts", { cwd: process.cwd() });
    const config: Options = {
      entry,
      splitting: false,
      sourcemap: true,
      clean: !(options.watch === true || options.watch === "true"),
      format: ["cjs", "esm"],
      dts: false,
      minify: true,
      ...overrideOptions,
    };

    return defineConfig(config);
  };
}
