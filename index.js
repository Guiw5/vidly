const genres = require('./routes/home')
const genres = require('./routes/genres')
const debug = require('debug')('app:startup')
const config = require('config')
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const Joi = require('joi')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(helmet()) //to handle differents request headers

//routes
app.use('/', home)
app.use('/api/genres', genres)

isDevelopment = () => app.get('env') === 'development'

if (isDevelopment()) {
  app.use(morgan('tiny'))
  debug('Morgan enabled...')
}

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening in port ${port}...`))
