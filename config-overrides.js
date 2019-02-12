const tsImportPluginFactory = require('ts-import-plugin')
const { getLoader, loaderNameMatches } = require("react-app-rewired")
const rewireCssModules = require("react-app-rewire-css-modules-simple")

module.exports = function override(config, env) {
  const tsLoader = getLoader(
    config.module.rules,
    rule =>
      rule.loader &&
      typeof rule.loader === 'string' &&
      rule.loader.includes('ts-loader')
  );

  tsLoader.options = {
    getCustomTransformers: () => ({
      before: [tsImportPluginFactory({
        libraryDirectory: 'es',
        libraryName: 'antd',
        style: 'css',
      })]
    })
  };

  config = rewireCssModules.withLoaderOptions({
    localIdentName: '[local]___[hash:base64:5]',
    modules: true
  })(config, env)

  return config;
}