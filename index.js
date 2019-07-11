const express = require('express')
const app = express()

const bodyParser = require('body-parser')

app.use(bodyParser.json())

let persons = [
  {
    "id": 1,
    "name": "Atte Gates",
    "number": "040-123456",
  },
  {
    "id": 2,
    "name": "Bill Gates",
    "number": "123123123",
  },
  {
    "id": 3,
    "name": "Gill Bates",
    "number": "666",
  },
  {
    "name": "testi",
    "number": "001",
    "id": 4
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const markup = `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  res.send(markup)
})

const port = 3001
app.listen(port)
console.log(`Running on port ${port}`)
