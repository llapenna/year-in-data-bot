import { defineConfig } from "tsup";

export default defineConfig(({ watch = false }) => ({
  entry: ["src/index.ts"],
  format: ["esm"],
  splitting: true,
  sourcemap: false,
  clean: true,
  target: "esnext",
  treeshake: true,
  dts: true,
  metafile: true,
  watch,
}));
