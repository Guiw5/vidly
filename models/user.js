const Joi = require('joi')
const mongoose = require('mongoose')

const User = mongoose.model(
  'User',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 50
    },
    email: {
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 255,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024
    }
  })
)

const validateUser = user => {
  const schema = {
    name: Joi.string()
      .required()
      .min(5)
      .max(50),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  }
  return Joi.validate(user, schema)
}

exports.User = User
exports.validate = validateUser
