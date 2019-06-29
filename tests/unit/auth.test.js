const { User } = require('../../models/user')
const auth = require('../../middleware/auth')
const mongoose = require('mongoose')

describe('Auth middleware', () => {
  it('should populate req.user with the payload of JWT', () => {
    const user = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
      email: 'qwe'
    }
    const token = new User(user).generateAuthToken()
    const req = { header: jest.fn().mockReturnValue(token) }
    const next = jest.fn()
    res = {}
    auth(req, res, next)

    expect(req.user).toMatchObject(user)
  })
})
