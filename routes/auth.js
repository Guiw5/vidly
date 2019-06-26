const Joi = require('joi')
const bcrypt = require('bcrypt')
const { User } = require('../models/user')

const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send('Invalid email or password.')

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(400).send('Invalid email or password.')
  return res.send('true')
})

const validate = auth => {
  const schema = {
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  }
  return Joi.validate(auth, schema)
}

module.exports = router