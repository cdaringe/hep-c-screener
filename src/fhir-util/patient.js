module.exports = {
  isBabyBoomer (patient) {
    if (!patient.birthDate) return false
    var dobYearString = patient.birthDate.split('-')[0]
    if (dobYearString) {
      var dobYear = parseInt(dobYearString, 10)
      if (!isNaN(dobYear)) {
        return dobYear > 1944 && dobYear < 1966
      }
    }
    return false
  }
}
