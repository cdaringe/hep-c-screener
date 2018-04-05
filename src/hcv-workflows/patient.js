var HCV_SNOMED_CODES = ['128302006', '50711007', '235866006']
if (process.env.HCV_SNOMED_CODES) {
  HCV_SNOMED_CODES = process.env.HCV_SNOMED_CODES.split(',').map(code => code.trim())
}
var HCV_SCREEN_LOINC_CODES = ['13955-0']
if (process.env.HCV_SCREEN_LOINC_CODES) {
  HCV_SCREEN_LOINC_CODES = process.env.HCV_SCREEN_LOINC_CODES.split(',').map(code => code.trim())
}

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
        var { data: { entry: entries = [] } } = res
        var conditions = entries.map(entry => entry.resource)
        var isHCVDetected = conditions.some(condition => {
          var snomedCodings = util.codings.getSystemCodings(condition, 'snomed')
          return snomedCodings.some(coding =>
            HCV_SNOMED_CODES.includes(coding.code)
          )
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
        var { data: { entry: entries = [] } } = res
        var observations = entries.map(entry => entry.resource)
        var hasHadScreening = observations.some(condition => {
          var loincCodings = util.codings.getSystemCodings(condition, 'loinc')
          return loincCodings.some(coding =>
            HCV_SCREEN_LOINC_CODES.includes(coding.code)
          )
        })
        if (hasHadScreening) {
          return hasHadScreening
        } else {
          if (res.data.total === 0) return false
          res = await client.nextPage({ bundle: res.data })
        }
      } while (res.data.entry.length)
      return false
    }
  }
}
