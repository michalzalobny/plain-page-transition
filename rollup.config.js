const resolve = require("@rollup/plugin-node-resolve");
const swc = require("rollup-plugin-swc").default;
const commonjs = require("@rollup/plugin-commonjs");
const glsl = require("rollup-plugin-glsl");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  input: "src/app/main.ts",
  output: {
    dir: "dist/js",
    format: "esm",
    sourcemap: !isProduction,
  },
  plugins: [
    resolve({ extensions: [".js", ".ts"] }),
    commonjs(),
    glsl({
      // By default, everything is included.
      include: "**/*.glsl",
      sourceMap: !isProduction,
      compress: false,
    }),
    swc({
      jsc: {
        target: "es5",
        parser: {
          syntax: "typescript",
        },
      },
      sourceMaps: !isProduction,
      minify: isProduction,
    }),
  ],
};
