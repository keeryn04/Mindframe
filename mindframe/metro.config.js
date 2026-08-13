const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// expo-sqlite ships a WASM-based web implementation. We don't use it
// (web repos use AsyncStorage instead), but Metro still needs to be
// able to resolve .wasm as an asset for the bundle to build at all.
config.resolver.assetExts.push('wasm');

module.exports = config;