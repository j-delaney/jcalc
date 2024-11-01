import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tsEslint from "typescript-eslint";

export default tsEslint.config(
  {
    ignores: [
      "public/module/", // Generated code
      "rollup.config.js", // Not a browser file
    ],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  eslintConfigPrettier,
);
