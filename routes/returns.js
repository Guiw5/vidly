const { Rental, validate } = require('../models/rental')
const { Movie } = require('../models/movie')
const auth = require('../middleware/auth')
const validator = require('../middleware/validator')
const express = require('express')
const router = express.Router()

router.post('/', [auth, validator(validate)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId)

  if (!rental)
    return res.status(404).send('The rental with the given ids doesn`t exists')

  if (rental.dateReturned)
    return res.status(400).send('The rental was already processed')

  rental.return()
  await rental.save()

  await Movie.update({ _id: rental.movie._id }, { $inc: { numberInStock: 1 } })
  res.send(rental)
})

module.exports = router
