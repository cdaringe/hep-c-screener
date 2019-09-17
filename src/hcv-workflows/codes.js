var HCV_SCREEN_PROCEDURE_LOINC_CODE = process.env.HCV_SCREEN_PROCEDURE_LOINC_CODE || '47365-2'

var VENIPUNCTURE_SNOMED_CODES = ['22778000']
if (process.env.VENIPUNCTURE_SNOMED_CODES) {
  VENIPUNCTURE_SNOMED_CODES = VENIPUNCTURE_SNOMED_CODES.split(',').map(code => code.trim())
}

var HCV_SNOMED_CODES = ['128302006', '50711007', '235866006']
if (process.env.HCV_SNOMED_CODES) {
  HCV_SNOMED_CODES = process.env.HCV_SNOMED_CODES.split(',').map(code => code.trim())
}
var HCV_SCREEN_OBSERVATION_LOINC_CODES = ['13955-0']
if (process.env.HCV_SCREEN_OBSERVATION_LOINC_CODES) {
  HCV_SCREEN_OBSERVATION_LOINC_CODES = process.env.HCV_SCREEN_OBSERVATION_LOINC_CODES.split(',').map(code =>
    code.trim()
  )
}

/**
 * Export HCV related code values, for various coding systems, used internally
 * by various FHIR workflows
 * @param {*} util
 * @returns {Object}
 */
module.exports = function codes (util) {
  return {
    HCV_SCREEN_OBSERVATION_LOINC_CODES,
    HCV_SCREEN_PROCEDURE_LOINC_CODE,
    HCV_SNOMED_CODES,
    VENIPUNCTURE_SNOMED_CODES
  }
}
