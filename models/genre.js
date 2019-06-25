const mongoose = require('mongoose')
const Joi = require('joi')

const Genre = mongoose.model(
  'Genre',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    }
  })
)

const validateGenre = name => {
  const schema = {
    name: Joi.string()
      .required()
      .min(3)
  }
  return Joi.validate(name, schema)
}

exports.Genre = Genre
exports.validate = validateGenre
