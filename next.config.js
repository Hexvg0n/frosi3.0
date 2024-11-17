const path = require('path');

const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'components');
    return config;
  },
};

module.exports = nextConfig;
