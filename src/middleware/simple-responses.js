var errors = require('../errors')

module.exports = async function simpleResponses (ctx, next) {
  var res
  try {
    res = await next()
    ctx.body = res
    ctx.status = 200
    return
  } catch (err) {
    if (err instanceof errors.ApiError) {
      ctx.body = { error: err.message || err.constructor.message }
      ctx.status = err.status || err.constructor.status
    } else {
      ctx.body = { error: 'Fatal error' }
      ctx.status = err.status || 500
    }
  }
}
