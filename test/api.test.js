var ava = require('ava').default
var axios = require('axios').default
var Service = require('../')
var freeport = require('util').promisify(require('freeport'))
var fixtures = require('./fixtures')

ava.beforeEach(async function (t) {
  var port = await freeport()
  t.context.api = new Service()
  t.context.origin = `http://localhost:${port}`
  await t.context.api.start({ server: { port } })
})
ava.afterEach.always(t => t.context.api.stop())

ava('service:get:cds-services', async function (t) {
  var res = await axios.get(`${t.context.origin}/cds-services`)
  t.is(res.data.services.length, 2, 'supports two hooks')
})

ava.only('service:post:order-review', async t => {
  var res = await axios.post(
    `${t.context.origin}/cds-services/hep-c-screener-order-review`,
    fixtures.hooks.orderReview.mildredVenipuncture
  )
  t.is(res.status, 200)
})
