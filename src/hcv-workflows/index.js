var fhir = require('fhir.js')
var patient = require('./patient')
var codings = require('./codings')
var screening = require('./screening')

function createClient ({ fhirServer, fhirAuthorization }) {
  var config = { baseUrl: fhirServer }
  if (fhirAuthorization) config.auth = fhirAuthorization
  return fhir(config)
}

var util = {}
module.exports = Object.assign(util, {
  createClient,
  codings: codings(util),
  patient: patient(util),
  screening: screening(util)
})
