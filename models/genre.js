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

const validateGenre = genre => {
  const schema = {
    name: Joi.string()
      .required()
      .min(5)
      .max(50)
  }
  return Joi.validate(genre, schema)
}

exports.Genre = Genre
exports.validate = validateGenre
