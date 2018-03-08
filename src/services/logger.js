var pino = require('pino')
var defaultsDeep = require('lodash/defaultsDeep')

module.exports = function (opts) {
  var logger = pino(
    defaultsDeep(
      {
        name: opts.name,
        prettyPrint: process.env.NODE_ENV === 'development'
      },
      opts.logger
    )
  )
  return logger
}
