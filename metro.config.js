const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;
defaultConfig.transformer = {
  ...defaultConfig.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};
defaultConfig.resolver = {
  assetExts: assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...sourceExts, 'svg'],
};

module.exports = mergeConfig(defaultConfig, {});
