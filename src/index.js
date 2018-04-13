var Koa = require('koa')
var defaultsDeep = require('lodash/defaultsDeep')
var { get, post } = require('koa-route')
var initServices = require('./services')
var fs = require('fs-extra')
var path = require('path')
var cors = require('koa-cors')
var workflows = require('./hcv-workflows/')
var keyBy = require('lodash/keyBy')
var screeningCards = require('./services/hcv-screen-cards')

var DISABLE_DEFAULT_SCREENING_ORDER = process.env.DISABLE_DEFAULT_SCREENING_ORDER || false
var HOOKS_FILENAME = path.join(__dirname, './hooks.json')
var MIDDLEWARE = ['response-time', 'logger', 'body-parser', 'simple-responses']

async function getDefaultServiceOpts () {
  return {
    name: process.env.SERVICE_NAME || 'hep-c-screener',
    logger: {
      level:
        process.env.LOG_LEVEL || process.env.NODE_ENV === 'development'
          ? 'debug'
          : 'warn'
    },
    server: {
      port: process.env.PORT || 8080
    }
  }
}

module.exports = class Service {
  /**
   * start API service
   * @param {*} opts
   * @param {Number} [port]
   */
  async start (opts) {
    opts = defaultsDeep(opts, await getDefaultServiceOpts())
    var app = new Koa()
    app.use(cors())
    var services = await initServices(app, opts)
    var hooks = JSON.parse(await fs.readFile(HOOKS_FILENAME))
    var hooksByHookName = keyBy(hooks, 'hook')
    MIDDLEWARE.forEach(mw => app.use(require(`./middleware/${mw}`)))
    app.use(
      get('/cds-services', async (ctx, id) => {
        return {
          services: hooks
        }
      })
    )
    app.use(
      post(
        `/cds-services/${hooksByHookName['patient-view'].id}`,
        async (ctx, id) => {
          var payload = ctx.request.body
          var requiresScreen = await workflows.screening.shouldScreen(payload)
          if (!requiresScreen) return { cards: [] }
          var screenProcedure
          var screenOrderButton
          if (DISABLE_DEFAULT_SCREENING_ORDER) {
            screenOrderButton =
            return screeningCards.propose({ screenProcedure })
          }
          var screenProcedure = await workflows.screening.createScreen(
            payload
          )
          return screeningCards.ordered({ screenProcedure })
        }
      )
    )
    app.use(
      post(
        `/cds-services/${hooksByHookName['order-review'].id}`,
        async (ctx, id) => {
          var payload = ctx.request.body
          var requiresScreen = await workflows.screening.shouldScreenIfVenipunctureOrder(
            payload
          )
          if (requiresScreen) {
            var screenProcedure = await workflows.screening.createScreen(payload)
            return screeningCards({ screenProcedure })
          }
          return { cards: [] }
        }
      )
    )
    this.server = app.listen(opts.server.port)
    services.logger.info(`🚀  listening @ http://localhost:${opts.server.port}`)
  }
  async stop () {
    if (this.server) this.server.close()
  }
}
