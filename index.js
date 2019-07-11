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
    "id": 4,
    "name": "testi",
    "number": "001",
  }
]

app.get('/info', (req, res) => {
  const markup = `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  res.send(markup)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => {
    return p.id === id
  })
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)

  res.status(204).end();
})


const port = 3001
app.listen(port)
console.log(`Running on port ${port}`)
