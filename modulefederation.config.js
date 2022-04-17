const { dependencies } = require('./package.json');

module.exports = {
  name: 'mafia_helper',
  filename: 'remoteEntry.js',
  remotes: {
    mafia2: 'mafia2@http://localhost:7501/remoteEntry.js',
  },
  exposes: {
    './LocationContextConsumer': './src/components/LocationContextConsumer.tsx',
  },
  shared: {
    ...dependencies,
    react: {
      singleton: true,
      requiredVersion: dependencies['react'],
    },
    'react-dom': {
      singleton: true,
      requiredVersion: dependencies['react-dom'],
    },
  },
};
