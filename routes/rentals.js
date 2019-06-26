const { Rental, validate } = require('../models/rental')
const { Movie } = require('../models/movie')
const { Customer } = require('../models/customer')
const Fawn = require('fawn')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()

Fawn.init(mongoose)

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('dateOut')
  res.send(rentals)
})

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const customer = await Customer.findById(req.body.customerId)
  if (!customer) return res.status(400).send('Invalid customer.')

  const movie = await Movie.findById(req.body.movieId)
  if (!movie) return res.status(400).send('Invalid movie.')

  let rental = new Rental({
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    },
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    }
  })
  try {
    new Fawn.Task()
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run()

    res.send(rental)
  } catch (ex) {
    res.status(500).send('Something failed.')
  }
})

router.put('/:id', auth, async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const rental = await rental.findByIdAndUpdate(
    req.params.id,
    { dateReturned: Date.now, rentalFee: 15 * (Date.now - rental.dateOut) },
    { new: true }
  )

  if (!rental) return res.status(404).send('The rental Id does not exists')

  res.send(rental)
})

router.delete('/:id', auth, async (req, res) => {
  const rental = await rental.findByIdAndRemove(req.params.id)
  if (!rental) return res.status(404).send('The rental Id does not exists')
  res.send(rental)
})

router.get('/:id', async (req, res) => {
  const rental = await rental.findById(req.params.id)
  if (!rental) return res.status(404).send('The rental Id does not exists')
  res.send(rental)
})

module.exports = router
