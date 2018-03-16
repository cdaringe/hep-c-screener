module.exports = {
  getSystemCodings (condition, system) {
    return condition.code.coding.filter(coding =>
      coding.system.match(/snomed/i)
    )
  }
}
