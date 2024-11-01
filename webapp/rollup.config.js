import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
  input: ["src/main.ts", "src/debug.ts"],
  output: {
    dir: "public/module/",
    format: "es",
    sourcemap: true,
    manualChunks: {
      "vendor.mathjs": ["mathjs"],
      "vendor.codeflask": ["codeflask"],
    },
  },
  plugins: [
    typescript(),
    resolve(), // tells Rollup how to find date-fns in node_modules
    commonjs(), // converts date-fns to ES modules
    production && terser(), // minify, but only in production
  ],
};
