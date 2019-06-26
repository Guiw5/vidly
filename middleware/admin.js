const jwt = require('jsonwebtoken')
const config = require('config')

//403 Forbidden (when you have rights authorization or a valid jwt, but don't have permissions)
module.exports = admin = (req, res, next) => {
  if (!req.user.isAdmin) res.status(403).send('Access denied')
  next()
}
