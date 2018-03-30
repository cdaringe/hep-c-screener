module.exports = function (util) {
  return {
    getSystemCodings (resource, system) {
      return resource.code.coding.filter(coding => coding.system.match(system))
    }
  }
}
