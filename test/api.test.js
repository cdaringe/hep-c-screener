var ava = require('ava').default
var axios = require('axios').default
var Service = require('../')
var freeport = require('util').promisify(require('freeport'))

ava.beforeEach(async function (t) {
  var port = await freeport()
  t.context.api = new Service()
  t.context.origin = `http://localhost:${port}`
  await t.context.api.start({ server: { port } })
})
ava.afterEach.always(t => t.context.api.stop())

ava('service:get:cds-services', async function (t) {
  var res = await axios.get(`${t.context.origin}/cds-services`)
  t.truthy(res.data.services.length === 1)
})
