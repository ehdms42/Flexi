module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@api': './src/api',
            '@hooks': './src/hooks',
            '@stores': './src/stores',
            '@components': './src/components',
            '@types': './src/types',
            '@constants': './src/constants',
            '@utils': './src/utils',
          },
        },
      ],
    ],
  };
};