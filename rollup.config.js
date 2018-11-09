import typescript from "rollup-plugin-typescript2";

const input = "./index.tsx";
const externals = ["react"];

export default [
  {
    entry: input,
    output: {
      file: "./dist/index.js",
      format: "cjs"
    },
    external: externals,
    plugins: [typescript()]
  },
  {
    entry: input,
    output: {
      file: "./dist/index.es.js",
      format: "es"
    },
    external: externals,
    plugins: [typescript()]
  }
];
