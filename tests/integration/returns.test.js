//I will create a return for a rental with TDD
//POST /api/returns {customerId, movieId}

//Return 401 if client is not logged in
//Return 400 if customerId is not provided
//Return 400 if movieId is not provided
//Return 404 if rentals is not found
//Return 400 if retanl was already processed
//Return 200 if it is valid
//Set the currentDate to returnDate
//Calculate the rentalFee
//Increase the stock
//return the rental

const moment = require('moment')
const { Movie } = require('../../models/movie')
const { Rental } = require('../../models/rental')
const { User } = require('../../models/user')
const mongoose = require('mongoose')
const request = require('supertest')

describe('/api/returns', () => {
  let server
  let rental
  let customerId
  let movieId
  let token
  let movie

  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId })
  }

  beforeEach(async () => {
    server = require('../../index')

    token = new User().generateAuthToken()
    customerId = new mongoose.Types.ObjectId()
    movieId = new mongoose.Types.ObjectId()

    movie = new Movie({
      _id: movieId,
      title: 'The Movie',
      dailyRentalRate: 5,
      numberInStock: 2,
      genre: { name: '12345' }
    })
    await movie.save()

    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345'
      },
      movie: {
        _id: movieId,
        title: 'The Movie',
        dailyRentalRate: 5
      }
    })
    await rental.save()
  })

  afterEach(async () => {
    await server.close()
    await Rental.deleteMany({})
    await Movie.deleteMany({})
  })

  it('should return 401 if the user is not logged in', async () => {
    token = ''
    const res = await exec()
    expect(res.status).toBe(401)
  })

  it('should return 400 if the customerId is not provided', async () => {
    customerId = ''
    const res = await exec()
    expect(res.status).toBe(400)
  })

  it('should return 400 if the movieId is not provided', async () => {
    movieId = ''
    const res = await exec()
    expect(res.status).toBe(400)
  })

  it('should return 404 if no rental found for this customer/movie', async () => {
    await Rental.deleteMany({})
    const res = await exec()
    expect(res.status).toBe(404)
  })

  it('should return 400 if rental was already processed', async () => {
    rental.dateReturned = Date.now()
    await rental.save()
    const res = await exec()
    expect(res.status).toBe(400)
  })

  it('should return 200 if is a valid request', async () => {
    const res = await exec()
    expect(res.status).toBe(200)
  })

  it('should set the returnDate if input is valid', async () => {
    const res = await exec()
    expect(res.body.dateReturned).not.toBeNull()
  })

  it('should set the return date', async () => {
    await exec()
    const rentalDb = await Rental.findById(rental._id)
    const diff = Date.now() - rentalDb.dateReturned
    expect(diff).toBeLessThan(10 * 1000)
  })

  it('should calculate the rental fee', async () => {
    rental.dateOut = moment().add(-7, 'days')
    rental.save()
    await exec()
    const rentalDb = await Rental.findById(rental._id)
    expect(rentalDb.rentalFee).toEqual(7 * rentalDb.movie.dailyRentalRate)
  })

  it('should increase the number in stock of the movie', async () => {
    const stockBefore = movie.numberInStock
    await exec()
    const movieDb = await Movie.findById(movieId)
    const stockAfter = movieDb.numberInStock
    expect(stockAfter).toBe(stockBefore + 1)
  })

  it('should send the rental object in response', async () => {
    const res = await exec()
    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        'dateOut',
        'dateReturned',
        'rentalFee',
        'customer',
        'movie'
      ])
    )
  })
})
