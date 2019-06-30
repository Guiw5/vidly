const express = require('express')
const error = require('../middleware/error')
const auth = require('../routes/auth')
const users = require('../routes/users')
const rentals = require('../routes/rentals')
const movies = require('../routes/movies')
const genres = require('../routes/genres')
const customers = require('../routes/customers')
const returns = require('../routes/returns')

module.exports = app => {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  //routes
  app.use('/api/genres', genres)
  app.use('/api/customers', customers)
  app.use('/api/movies', movies)
  app.use('/api/rentals', rentals)
  app.use('/api/users', users)
  app.use('/api/auth', auth)
  app.use('/api/returns', returns)
  //error middleware to write logs and send 500 status responses
  app.use(error)
}
