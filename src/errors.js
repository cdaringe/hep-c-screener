class ApiError extends Error {}
class Api400 extends ApiError {}
Api400.status = 400
Api400.message = 'Invalid request'
class Api401 extends ApiError {}
Api401.status = 401
Api401.message = 'Unauthorized'
class Api404 extends ApiError {}
Api404.status = 404
Api404.message = 'Not found'
class Api500 extends ApiError {}
Api500.status = 500
Api500.message = 'Internal error.  File a bug to us, please!'

module.exports = {
  ApiError,
  Api400,
  Api401,
  Api404,
  Api500
}
