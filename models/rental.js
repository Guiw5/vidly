const moment = require('moment')
const mongoose = require('mongoose')
const Joi = require('joi')

rentalSchema = new mongoose.Schema({
  dateOut: { type: Date, required: true, default: Date.now },
  dateReturned: { type: Date },
  rentalFee: { type: Number, min: 0 },
  customer: {
    type: new mongoose.Schema({
      name: { type: String, required: true, minlength: 5, maxlength: 50 },
      isGold: { type: Boolean, defaul: false },
      phone: { type: String, required: true, minlength: 5, maxlength: 50 }
    }),
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
      }
    }),
    required: true
  }
})

rentalSchema.methods.return = function() {
  this.dateReturned = Date.now()

  const days = moment(this.dateReturned).diff(this.dateOut, 'days')
  this.rentalFee = days * this.movie.dailyRentalRate
}

rentalSchema.statics.lookup = function(customerId, movieId) {
  return this.findOne({
    'customer._id': customerId,
    'movie._id': movieId
  })
}

const Rental = mongoose.model('Rental', rentalSchema)

const validateRental = rental => {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  }

  return Joi.validate(rental, schema)
}

exports.Rental = Rental
exports.validate = validateRental
