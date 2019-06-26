const { Genre } = require('./genre')
const mongoose = require('mongoose')
const Joi = require('joi')

const Movie = mongoose.model(
  'Movie',
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255
    },
    genre: { type: Genre.schema, required: true },
    numberInStock: { type: Number, required: true, min: 0, max: 255 },
    dailyRentalRate: { type: Number, required: true, min: 0, max: 255 }
  })
)

const validateMovie = movie => {
  const schema = {
    title: Joi.string()
      .required()
      .min(5)
      .max(255),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number()
      .min(0)
      .required(),
    dailyRentalRate: Joi.number()
      .min(0)
      .required()
  }

  return Joi.validate(movie, schema)
}

exports.Movie = Movie
exports.validate = validateMovie
