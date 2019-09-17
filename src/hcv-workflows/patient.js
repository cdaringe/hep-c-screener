module.exports = function (util) {
  return {
    isBabyBoomer (patient) {
      if (!patient.birthDate) return false
      var dobYearString = patient.birthDate.split('-')[0]
      if (!dobYearString) return false
      var dobYear = parseInt(dobYearString, 10)
      if (!isNaN(dobYear)) {
        return dobYear > 1944 && dobYear < 1966
      }
      return false
    },
    async hasHCV ({ client, patient }) {
      var res = await client.search({
        type: 'Condition',
        query: { patient: `${patient.id}` }
      })
      do {
        var {
          data: { entry: entries = [] }
        } = res
        var conditions = entries.map(entry => entry.resource)
        var isHCVDetected = conditions.some(condition => {
          var snomedCodings = util.codings.getSystemCodings(condition, 'snomed')
          return snomedCodings.some(coding => util.codes.HCV_SNOMED_CODES.includes(coding.code))
        })
        if (isHCVDetected) {
          return isHCVDetected
        } else {
          if (res.data.total === 0) return false
          res = await client.nextPage({ bundle: res.data })
        }
      } while (res.data.entry.length)
      return false
    },
    async hasPreviousHCVScreen ({ client, patient }) {
      var res = await client.search({
        type: 'Observation',
        query: {
          patient: `${patient.id}`,
          category: 'laboratory'
        }
      })
      do {
        var {
          data: { entry: entries = [] }
        } = res
        var observations = entries.map(entry => entry.resource)
        var hasHadScreening = observations.some(condition => {
          var loincCodings = util.codings.getSystemCodings(condition, 'loinc')
          return loincCodings.some(coding => util.codes.HCV_SCREEN_OBSERVATION_LOINC_CODES.includes(coding.code))
        })
        if (hasHadScreening) {
          return hasHadScreening
        } else {
          if (res.data.total === 0) return false
          res = await client.nextPage({ bundle: res.data })
        }
      } while (res.data.entry.length)
      return false
    },
    async hasOutstandingProcedureRequest ({ client, patient }) {
      var res = await client.search({
        type: 'ProcedureRequest',
        query: {
          patient: `${patient.id}`
        }
      })
      do {
        var {
          data: { entry: entries = [] }
        } = res
        var procedures = entries.map(entry => entry.resource)
        var hasOutstandingProcedureRequest = procedures.some(procedureRequest => {
          var loincCodings = util.codings.getSystemCodings(procedureRequest, 'loinc')
          var hasExistingProcedureRequest = loincCodings.some(
            coding => util.codes.HCV_SCREEN_PROCEDURE_LOINC_CODE === coding.code
          )
          if (hasExistingProcedureRequest) {
            if (procedureRequest.status.match(/draft|active|completed/)) {
              return true
            }
            return false
          }
        })
        if (hasOutstandingProcedureRequest) {
          return hasOutstandingProcedureRequest
        } else {
          if (res.data.total === 0) return false
          res = await client.nextPage({ bundle: res.data })
        }
      } while (res.data.entry.length)
      return false
    }
  }
}
