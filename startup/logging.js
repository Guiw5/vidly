require('express-async-errors')
const config = require('config')
const winston = require('winston')
require('winston-mongodb')

module.exports = () => {
  const customColors = {
    error: 'bold red',
    warn: 'italic bold yellow',
    info: 'italic cyan',
    verbose: 'blue',
    debug: 'magenta',
    silly: 'whiteBG'
  }

  //winston.addColors(customColors)
  let format = winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint(),
    winston.format.colorize({ colors: customColors, all: true })
  )
  let myConsole = new winston.transports.Console({ format: format })

  winston.add(myConsole)
  winston.add(new winston.transports.File({ filename: 'logs/logfile.log' }))
  winston.add(
    new winston.transports.MongoDB({ db: config.get('db'), level: 'error' })
  )

  process.on('unhandledRejection', ex => {
    throw ex
  })

  winston.exceptions.handle(
    new winston.transports.File({ filename: 'logs/uncaughtExceptions.log' }),
    myConsole
  )
}
