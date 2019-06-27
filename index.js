require('express-async-errors')
let winston = require('winston')
require('winston-mongodb')

const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const error = require('./middleware/error')
const auth = require('./routes/auth')
const users = require('./routes/users')
const rentals = require('./routes/rentals')
const movies = require('./routes/movies')
const genres = require('./routes/genres')
const customers = require('./routes/customers')

const mongoose = require('mongoose')
const express = require('express')

const debug = require('debug')('app:startup')
const config = require('config')
const helmet = require('helmet')
const morgan = require('morgan')
const app = express()

process.on('unhandledRejection', ex => {
  throw ex
})

winston.exceptions.handle(
  new winston.transports.File({ filename: 'uncaughtExceptions.log' })
)

winston.add(new winston.transports.Console())
winston.add(new winston.transports.File({ filename: 'logfile.log' }))
winston.add(
  new winston.transports.MongoDB({ db: config.get('db'), level: 'error' })
)

if (!config.get('jwtPrivateKey')) {
  console.log('FATAL ERROR: jwtPrivateKey is not defined')
  process.exit(1)
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(helmet()) //to handle differents request headers

//routes
app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)
app.use('/api/users', users)
app.use('/api/auth', auth)

//adding error middleware to write logs and send 500 status responses
app.use(error)

isDevelopment = () => app.get('env') === 'development'

if (isDevelopment()) {
  app.use(morgan('tiny'))
  debug('Morgan enabled...')
}

mongoose
  .connect(config.get('db'), { useNewUrlParser: true }) //if doesn't exist it will be created
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Could not connect to db', err))

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening in port ${port}...`))
