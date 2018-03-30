var Koa = require('koa')
var defaultsDeep = require('lodash/defaultsDeep')
var { get, patch, post, put, delete: del } = require('koa-route')
var errors = require('./errors')
var initServices = require('./services')
var fs = require('fs-extra')
var path = require('path')
var cors = require('koa-cors')
var workflows = require('./hcv-workflows/')
var keyBy = require('lodash/keyBy')

var HOOKS_FILENAME = path.join(__dirname, './hooks.json')
var MIDDLEWARE = ['response-time', 'logger', 'body-parser', 'simple-responses']
var CARD_SOURCE = {
  label: 'hep-c-screenr',
  url: 'https://example.com'
}

async function getDefaultServiceOpts () {
  return {
    name: process.env.SERVICE_NAME || 'hep-c-screenr',
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
          var requiresScreen = await workflows.screening.shouldScreen(
            ctx.request.body
          )
          if (requiresScreen) {
            var cards = []
            // has done screening?
            cards.push({
              summary: 'You are a baby boomer!',
              detail: 'So... get checked!',
              indicator: 'warning',
              source: CARD_SOURCE
            })
          }
          return {
            cards
          }
        }
      )
    )
    app.use(
      post(
        `/cds-services/${hooksByHookName['order-review'].id}`,
        async (ctx, id) => {
          var requiresScreen = await workflows.screening.shouldScreenOnOrder(
            ctx.request.body
          )
          if (requiresScreen) {
            var cards = []
            // has done screening?
            cards.push({
              summary: 'Example Card',
              indicator: 'info',
              detail:
                'Add an XYZ complimentary medication OR switch patient order to ABC. See SMART app for more details.',
              source: CARD_SOURCE,
              suggestions: [
                {
                  label: 'Cancel Hepatatis C Screening',
                  uuid: '123',
                  actions: [
                    {
                      type: 'delete',
                      description: 'Cancel ABC',
                      resource: 'MedicationRequest/ABC'
                    }
                  ]
                }
              ]
            })
          }
          return {
            cards
          }
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
