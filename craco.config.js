const CracoModuleFederation = require('craco-module-federation');

module.exports = {
  plugins: [
    {
      plugin: CracoModuleFederation,
    },
  ],
  devServer: {
    port: 7500,
  },
};
