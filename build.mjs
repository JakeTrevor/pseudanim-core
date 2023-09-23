import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/interpreter/cli.ts"],
  bundle: true,
  platform: "node",
  packages: "external",
  outdir: "out",
  format: "esm",
});
