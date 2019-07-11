const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())

morgan.token('reqBody', function (req, res) {
  return req.method === 'POST' ? JSON.stringify(req.body) : null
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))

app.use(cors())

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

app.post('/api/persons', (req, res) => {
  const body = req.body

  let errors = []

  if (!body.name) {
    errors.push('name missing')
  }
  if (!body.number) {
    errors.push('number missing')
  }
  if (persons.find(p => p.name === body.name)) {
    errors.push(`information for ${body.name} already exists`)
  }

  if (errors.length > 0) {
    return res.status(400).json(errors)
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  res.json(person)

})

// does not work if there are more than 665 persons but do not care about it for now.
generateId = () => {
  let i;
  do {
    i = Math.floor(Math.random() * Math.floor(666))
  } while (persons.find(p => p.id === i))
  return i;
}

const port = 3001
app.listen(port)
console.log(`Running on port ${port}`)
