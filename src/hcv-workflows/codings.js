module.exports = function (util) {
  return {
    getSystemCodings (condition, system) {
      return condition.code.coding.filter(coding => coding.system.match(system))
    }
  }
}
