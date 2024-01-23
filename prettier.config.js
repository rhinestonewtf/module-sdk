/** @type {import("prettier").Config} */
const config = {
  semi: false,
  singleQuote: true,
  bracketSpacing: true,
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  plugins: ["prettier-plugin-sort-imports-desc"],
};
module.exports = config;