module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ios.ts', '.android.ts', '.ts', '.ios.tsx', '.android.tsx', '.tsx', '.jsx', '.js', '.json'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '~': ['./assets'],
          'icons': './assets/icons',
          'images': './assets/images',
          'videos': './assets/videos',
        },
      },
    ]
    ,
    // react-native-dotenv
    [
      'module:react-native-dotenv',
      {
        "envName": "APP_ENV",
        "moduleName": "@env",
        "path": ".env.local",
        "blocklist": null,
        "allowlist": null,
        "blacklist": null,
        "whitelist": null,
        "safe": false,
        "allowUndefined": true,
        "verbose": false
      },
    ],
  ],
};
