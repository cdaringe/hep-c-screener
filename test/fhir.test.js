var ava = require('ava').default
var axios = require('axios').default
var fhir = require('fhir.js')

ava.beforeEach(async function (t) {
  t.context.client = fhir({
    baseUrl: process.env.FHIR_URL || 'https://api.hspconsortium.org/cdshooksdstu2/open'
  })
})

ava.only('fhir:Procedure', async function (t) {
  var client = t.context.client
  var res = await client.search({
    type: 'Procedure',
    query: {
      patient: 'SMART-8888801'
    }
  })
  t.truthy(res)
})
