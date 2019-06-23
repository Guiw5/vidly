const express = require('express')
const Joi = require('joi')
const router = express.Router()

let genres = [
  { id: 1, name: 'thriller' },
  { id: 2, name: 'action' },
  { id: 3, name: 'terror' },
  { id: 4, name: 'drama' }
]

router.get('/', (req, res) => {
  res.send(genres)
})

router.post('/', (req, res) => {
  const { error } = validateGenre(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const genre = {
    id: genres.length + 1,
    name: req.body.name
  }
  genres = [...genres, genre]
  res.send(genre)
})

router.put('/:id', (req, res) => {
  let genre = genres.find(x => x.id === parseInt(req.params.id))
  if (!genre) return res.status(404).send('The genre Id does not exists')

  const { error } = validateGenre(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  genre.name = req.body.name
  res.send(genre)
})

router.delete('/:id', (req, res) => {
  let genre = genres.find(x => x.id === parseInt(req.params.id))
  if (!genre) return res.status(404).send('The genre Id does not exists')

  genres = genres.filter(x => x.id === genre.id)
})

validateGenre = name => {
  const schema = {
    name: Joi.string()
      .required()
      .min(3)
  }
  return Joi.validate(name, schema)
}
module.exports = router
