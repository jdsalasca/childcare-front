module.exports = function override(config, env) {
    config.resolve.fallback = {
      fs: false,
      crypto: false
    };
    return config;
  };
  