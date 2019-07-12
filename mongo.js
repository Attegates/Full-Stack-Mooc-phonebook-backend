const mongoose = require('mongoose')


if (process.argv.length < 3) {
  console.log('Usage:\n')
  console.log('print all persons:')
  console.log('\tnode ex3.12.js <password>\n')
  console.log('add a person:')
  console.log('\tnode ex3.12.js <password> <"forename surname"> <number>')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://atteg:${password}@cluster0-ccapr.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(p => {
      console.log(p)
    })
    mongoose.connection.close()
  })
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  person.save().then(response => {
    console.log(`person ${person} saved`)
    mongoose.connection.close()
  })  // don't care about errors for now.
}
