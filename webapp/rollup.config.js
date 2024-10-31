import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
  input: ["src/main.js", "src/debug.js"],
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
    resolve(), // tells Rollup how to find date-fns in node_modules
    commonjs(), // converts date-fns to ES modules
    production && terser(), // minify, but only in production
  ],
};
