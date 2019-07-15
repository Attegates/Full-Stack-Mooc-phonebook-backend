require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(bodyParser.json())

morgan.token('reqBody', function (req, res) {
  return req.method === 'POST' ? JSON.stringify(req.body) : null
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))

app.use(cors())
app.use(express.static('build'))

/*
app.get('/info', (req, res) => {
  const markup = `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  res.send(markup)
})
*/

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(p => p.toJSON()))
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      next(error)
    })
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  let errors = []

  if (!body.name) {
    errors.push('name missing')
  }
  if (!body.number) {
    errors.push('number missing')
  }
  /* don't care about duplicates for now.
  if (persons.find(p => p.name === body.name)) {
    errors.push(`information for ${body.name} already exists`)
  }
  */

  if (errors.length > 0) {
    return res.status(400).json(errors)
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(savedPerson => {
      res.json(savedPerson.toJSON())
    })
    .catch(error => {
      next(error)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => {
      next(error)
    })
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const port = process.env.PORT || 3001
app.listen(port)
console.log(`Running on port ${port}`)
