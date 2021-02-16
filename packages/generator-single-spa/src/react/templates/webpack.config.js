const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react<% if (typescript) { %>-ts<% } %>");
const path = require("path");
const externals = require('./externals');

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "<%= orgName %>",
    projectName: "<%= projectName %>",
    webpackConfigEnv,
    argv,
  });
  const standalone = Boolean(webpackConfigEnv.standalone);
  return merge(defaultConfig, {
    entry: standalone ? './src/index.tsx' : './src/<%= orgName %>-<%= projectName %>.tsx',
    module: {
      rules: [
        {
          test: /\.less$/,
          exclude: /\.module\.less$/,
          include: [/src/],
          use: [
            {
              loader: require.resolve("style-loader"),
            },
            {
              loader: require.resolve("css-loader"),
              options: {
                modules: false
              }
            },
            {
              loader: require.resolve("less-loader")
            }
          ]
        },
        {
          test: /\.module\.less$/,
          include: [/src/],
          use: [
            {
              loader: require.resolve("style-loader"),
            },
            {
              loader: require.resolve("css-loader"),
              options: {
                modules: { localIdentName: `[${defaultConfig.output.uniqueName}][path][name][hash:base64:5]` },
              },
            },
            {
              loader: require.resolve("less-loader")
            }
          ]
        }
      ]
    },
    resolve: {
      alias: {
        '@src': path.resolve(__dirname, './src')
      }
    },
    externals: standalone ? [] : externals
  })
};
