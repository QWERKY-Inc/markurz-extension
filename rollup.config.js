import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { dts } from "rollup-plugin-dts";
// Uncomment for UMD setup. Should not be needed unless we target non-Node.js environments.
// import { terser } from "rollup-plugin-terser";
// import babel from "@rollup/plugin-babel";
// import alias from "@rollup/plugin-alias";
// import { fileURLToPath } from "url";
import external from "rollup-plugin-peer-deps-external";
import css from "rollup-plugin-import-css";

import replace from "@rollup/plugin-replace";

const packageJson = require("./package.json");

const envKeys = () => {
  const envRaw = require("dotenv").config().parsed || {};

  return Object.keys(envRaw).reduce(
    (envValues, envValue) => ({
      ...envValues,
      [`process.env.${envValue}`]: JSON.stringify(envRaw[envValue]),
    }),
    {},
  );
};

export default [
  // Uncomment for UMD setup. Should not be needed unless we target non-Node.js environments.
  // {
  //   // UMD
  //   input: "src/index.ts",
  //   plugins: [
  //     nodeResolve(),
  //     babel({
  //       babelHelpers: "bundled",
  //     }),
  //     terser(),
  //     alias({
  //       entries: {
  //         src: fileURLToPath(new URL("src", import.meta.url)),
  //       },
  //     }),
  //   ],
  //   output: {
  //     file: `dist/${packageJson.name}.min.js`,
  //     format: "umd",
  //     name: "markurz",
  //     esModule: false,
  //     exports: "named",
  //     sourcemap: true,
  //   },
  // },
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
        exports: "named",
      },
    ],
    external: ["react", "react-dom"],
    plugins: [
      // Uncomment for UMD setup. Will resolve absolute imports to match the current file tree.
      // alias({
      //   entries: {
      //     src: fileURLToPath(new URL("src", import.meta.url)),
      //   },
      // }),
      replace(envKeys()),
      external(),
      css(),
      nodeResolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
    ],
  },
  {
    input: "dist/esm/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
  },
];
