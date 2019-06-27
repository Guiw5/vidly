const mongoose = require('mongoose')
const config = require('config')
const winston = require('winston')

module.exports = () => {
  mongoose
    .connect(config.get('db'), { useNewUrlParser: true }) //if doesn't exist it will be created
    .then(() => winston.info('Connected to MongoDB'))
}
