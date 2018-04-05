module.exports = function (util) {
  return {
    async createScreen (cdsPayload) {
      var client = util.createClient(cdsPayload)
      var patient = cdsPayload.prefetch.patient.resource
      var res = await client.create({
        resource: {
          resourceType: 'ProcedureRequest',
          code: {
            coding: [
              {
                code: util.codes.HCV_SCREEN_PROCEDURE_LOINC_CODE,
                system: 'http://loinc.org/'
              }
            ]
          },
          status: 'draft',
          intent: 'proposal',
          subject: {
            reference: `Patient/${patient.id}`
          }
        }
      })
      return res.data
    },
    async shouldScreen (cdsPayload) {
      var patient = cdsPayload.prefetch.patient.resource
      var client = util.createClient(cdsPayload)
      var isBoomer = util.patient.isBabyBoomer(patient)
      if (!isBoomer) return false
      var [
        hasHCV,
        hasOutstandingProcedureRequest,
        hasPreviousHCVScreen
      ] = await Promise.all([
        util.patient.hasHCV({ client, patient }),
        util.patient.hasOutstandingProcedureRequest({ client, patient }),
        util.patient.hasPreviousHCVScreen({ client, patient })
      ])
      return !hasHCV && !hasPreviousHCVScreen && !hasOutstandingProcedureRequest
    },
    async shouldScreenIfVenipunctureOrder (cdsPayload) {
      var isVenipuncture = cdsPayload.context.orders.some(order => {
        var snomedCodings = util.codings.getSystemCodings(order, 'snomed')
        return snomedCodings.some(coding =>
          util.codes.VENIPUNCTURE_SNOMED_CODES.includes(coding.code)
        )
      })
      if (!isVenipuncture) return false
      return this.shouldScreen(cdsPayload)
    }
  }
}
