var fhir = require('fhir.js')
var patient = require('./patient')

function createClient ({ fhirServer, fhirAuthorization }) {
  var config = {
    baseUrl: fhirServer
  }
  if (fhirAuthorization) config.auth = fhirAuthorization
  return fhir(config)
}
module.exports = {
  createClient,
  patient
}
