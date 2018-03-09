var createLogger = require('./logger')

module.exports = async function init (app, opts) {
  var logger = createLogger(opts)

  // general purpose services
  return {
    logger
  }
}
