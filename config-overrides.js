const {aliasWebpack, aliasJest} = require('react-app-alias')

const options = {} // default is empty for most cases

//module.exports = function override(config) {
  //const plugins = config.resolve.plugins
  //config.resolve.plugins = [...plugins, new TsconfigPathsPlugin()]
  //return aliasWebpack(options)(config)
//}

module.exports = aliasWebpack(options)
module.exports.jest = aliasJest(options)