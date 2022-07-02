const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))

morgan.token('object', (request, response) => {
   return `${JSON.stringify(request.body)}`
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))

let persons = [
   { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
   response.json(persons)
   
})

app.get('/api/persons/:id', (request, response) => {
   const id = Number(request.params.id)
   const person = persons.find(p => p.id === id)

   if (person) {
      response.json(person)
   } else {
      response.status(404).end()
   }
})

app.delete('/api/persons/:id', (request, response) => {
   const id = Number(request.params.id)
   persons = persons.filter(p => p.id !== id)

   response.status(204).end()

})
app.get('/api/info', (request, response) => {
   const information = {
      entries: `Phone book has ${persons.length} people`,
      date: new Date()
   }
   response.send(`
      <p>${information.entries}</p>
      <p>${information.date}</p>
   `)
})

const generatedID = () => {
   const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
      return response.status(400).json({error: "Name is missing"})
    }
   
    if (!body.number) {
      return response.status(400).json({error: "Number is missing"})
    }

    if (persons.some(entry => entry.name === body.name)) {
      return response.status(400).json({error: "name must be unique"})
    }

   const entry = {
      id: generatedID(),
      name: body.name,
      number: body.number
   }

   persons.push(entry)
   response.json(entry)
})


const PORT = 3001

app.listen(PORT, () => {
   console.log(`Sever running on ${PORT}`)
})