const mongoose = require('mongoose')
const config = require('config')
const winston = require('winston')

module.exports = () => {
  const db = config.get('db')
  mongoose
    .connect(db, { useNewUrlParser: true }) //if doesn't exist it will be created
    .then(() => winston.info(`Connected to ${config.get('db')}`))
}
