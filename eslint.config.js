import paratcoEslintConfig from "@paratco/eslint-config";

export default [
  ...paratcoEslintConfig.node,
  ...paratcoEslintConfig.stylisticFormatter,
  ...paratcoEslintConfig.import,

  // TypeScript Rules
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
  },
  {
    rules: {
      "import-x/no-extraneous-dependencies": "off"
    },
  },
  {
    ignores: ["dist", "eslint.config.js", "rollup.config.js"],
  }
];
