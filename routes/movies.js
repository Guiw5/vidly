const admin = require('../middleware/admin')
const auth = require('../middleware/auth')
const { Genre } = require('./genres')
const { Movie, validate } = require('../models/movie')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('name')
  res.send(movies)
})

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const genre = await Genre.findById(req.body.genreId)
  if (!genre) return res.status(400).send('Invalid genre.')

  const movie = new Movie({
    title: req.body.name,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  })

  await movie.save()
  res.send(movie)
})

router.put('/:id', auth, async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const movie = await movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.name,
      genre: Genre.findById(req.body.genreId),
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    },
    { new: true }
  )

  if (!movie) return res.status(404).send('The movie Id does not exists')

  res.send(movie)
})

router.delete('/:id', [auth, admin], async (req, res) => {
  const movie = await movie.findByIdAndRemove(req.params.id)
  if (!movie) return res.status(404).send('The movie Id does not exists')
  res.send(movie)
})

router.get('/:id', async (req, res) => {
  const movie = await movie.findById(req.params.id)
  if (!movie) return res.status(404).send('The movie Id does not exists')
  res.send(movie)
})

module.exports = router
