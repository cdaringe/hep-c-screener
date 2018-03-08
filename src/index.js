var Koa = require('koa')
var defaultsDeep = require('lodash/defaultsDeep')
var { get, patch, post, put, delete: del } = require('koa-route')
var errors = require('./errors')
var initServices = require('./services')
var fs = require('fs-extra')
var path = require('path')
var cors = require('koa-cors')

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
        return {
          cards: [
            {
              summary: 'Ronald Reagan sucks.',
              detail: 'no, seriously, he really, really sucks',
              indicator: 'warning',
              source: {
                label: 'meh, cant do nothin about it!'
              }
            }
          ]
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
