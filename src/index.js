var Koa = require('koa')
var defaultsDeep = require('lodash/defaultsDeep')
var { get, patch, post, put, delete: del } = require('koa-route')
var errors = require('./errors')
var initServices = require('./services')
var fs = require('fs-extra')
var path = require('path')
var cors = require('koa-cors')
var workflows = require('./hcv-workflows/')

var HOOK_FILENAME = path.join(__dirname, './hook.json')
var MIDDLEWARE = ['response-time', 'logger', 'body-parser', 'simple-responses']

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
    var hook = JSON.parse(await fs.readFile(HOOK_FILENAME))
    MIDDLEWARE.forEach(mw => app.use(require(`./middleware/${mw}`)))
    app.use(
      get('/cds-services', async (ctx, id) => {
        return {
          services: [hook]
        }
      })
    )
    var dummyPostRouteName = `/cds-services/${hook.id}`
    app.use(
      post(dummyPostRouteName, async (ctx, id) => {
        var requiresScreen = await workflows.screening.shouldScreen(
          ctx.request.body
        )
        if (requiresScreen) {
          var cards = []
          // has done screening?
          cards.push({
            summary: 'HCV Screen Required',
            detail: 'Patient needs HCV screen due to meeting criteria from the CDC',
            indicator: 'warning',
            source: {
              label: 'https://www.cdc.gov/hepatitis/hcv/guidelinesc.htm'
            },
            suggestions: [
              {
                label: 'Cancel HCV Screening',
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
      })
    )
    this.server = app.listen(opts.server.port)
    services.logger.info(`🚀  listening @ http://localhost:${opts.server.port}`)
  }
  async stop () {
    if (this.server) this.server.close()
  }
}
