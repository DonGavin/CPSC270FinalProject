const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const path = require("path");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = async function (env, argv) {
  const isEnvProduction = env.mode === "production";
  const config = await createExpoWebpackConfigAsync(env, argv);

  if (!config.experiments) {
    config.experiments = {};
  }
  config.experiments.asyncWebAssembly = true;

  config.plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(
            __dirname,
            "node_modules/stockfish.js/stockfish.js",
          ),
          to: path.resolve(config.output.path, "stockfish.js"),
        },
        {
          from: path.resolve(
            __dirname,
            "node_modules/stockfish.js/stockfish.wasm",
          ),
          to: path.resolve(config.output.path, "stockfish.wasm"),
        },
      ],
    }),
  );

  if (config.devServer && config.devServer.devMiddleware) {
    if (!config.devServer.devMiddleware.mimeTypes) {
      config.devServer.devMiddleware.mimeTypes = {};
    }
    config.devServer.devMiddleware.mimeTypes[".wasm"] = "application/wasm";
  }

  if (isEnvProduction) {
    config.plugins.push(
      new WorkboxWebpackPlugin.InjectManifest({
        swSrc: path.resolve(__dirname, "src/service-worker.js"),
        dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
        exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/, /\.js\.gz$/],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      }),
    );
  }

  return config;
};
