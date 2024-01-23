module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  plugins: ["@typescript-eslint"],
  extends: ["@react-native-community", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
        useTabs: false,
        trailingComma: "es5",
      },
    ],
  },
};
