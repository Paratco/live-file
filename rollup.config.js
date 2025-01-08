import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { dts } from "rollup-plugin-dts";

const config = [
  {
    input: `src/index.ts`,
    output: { dir: "dist", format: "es", sourcemap: false },
    perf: true,
    plugins: [typescript({ tsconfig: "tsconfig.json" }), dts()]
  },
  {
    input: `src/index.ts`,
    output: [
      {
        file: `dist/index.mjs`,
        format: "es",
        sourcemap: true,
        compact: true
      },
      {
        file: `dist/index.cjs`,
        format: "cjs",
        sourcemap: true,
        compact: true
      }
    ],
    perf: true,
    plugins: [
      typescript({ tsconfig: "tsconfig.json" }),
      terser({ format: { ecma: 2020 }, compress: { passes: 3 }, sourceMap: true })
    ]
  }
];

export default config;
