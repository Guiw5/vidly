/**
 * This is to figure out how exceptions can be handled by a middleware
 * but currently, express-async-errors module is resolving it
 */

function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res)
    } catch (ex) {
      next(ex)
    }
  }
}

module.exports = asyncMiddleware
