module.exports = function (util) {
  return {
    async shouldScreen (cdsPayload) {
      var patient = cdsPayload.prefetch.patient.resource
      var client = util.createClient(cdsPayload)
      var isBoomer = util.patient.isBabyBoomer(patient)
      if (!isBoomer) return false
      var [hasHCV, hasPreviousHCVScreen] = await Promise.all([
        util.patient.hasHCV({ client, patient }),
        util.patient.hasPreviousHCVScreen({ client, patient })
      ])
      return !hasHCV && !hasPreviousHCVScreen
    },
    async shouldScreenOnOrder (cdsPayload) {
      var patient = cdsPayload.prefetch.patient.resource
      var client = util.createClient(cdsPayload)
    }
  }
}
