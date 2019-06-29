const { User } = require('../../models/user')
const jwt = require('jsonwebtoken')
const config = require('config')
const mongoose = require('mongoose')

describe('user.generateAuthToken', () => {
  it('Should be generate a valid jwt with user props in payload', () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
      email: 'a'
    }
    const token = new User(payload).generateAuthToken()
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
    expect(decoded).toMatchObject(payload)
  })
})
