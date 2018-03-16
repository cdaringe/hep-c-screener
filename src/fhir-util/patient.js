var fhirConditions = require('./conditions')

var HCV_SNOMED_CODES = ['128302006', '50711007', '235866006']

module.exports = {
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
    var { data: { entry: entries } } = await client.search({
      type: 'Condition',
      query: { patient: `${patient.id}` }
    })
    var conditions = entries.map(entry => entry.resource)
    var isHCVDetected = conditions.some(condition => {
      var snomedCodings = fhirConditions.getSystemCodings(condition, 'snomed')
      return snomedCodings.some(coding =>
        HCV_SNOMED_CODES.includes(coding.code)
      )
    })
    return isHCVDetected
  }
}
