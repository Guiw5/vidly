const express = require('express')
const joi = require('joi')

const app = express()
app.use(express.json())

let genres = [
  { id: 1, genre: 'thriller' },
  { id: 2, genre: 'action' },
  { id: 3, genre: 'terror' },
  { id: 3, genre: 'drama' }
]

app.get('/genres', (req, res) => {
  res.send(genres)
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening in port ${port}...`))
