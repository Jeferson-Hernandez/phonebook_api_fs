const morgan = require('morgan')
const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

morgan.token('body', function (req, res) {
    if (Object.keys(req.body).length) {
        return JSON.stringify(req.body)
    }
});

let data = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    },
]

app.get('/api/persons', (req, res) => {
    res.json(data)
})

app.get('/info', (req, res) => {
    const date = new Date()
    console.log(date.toUTCString())
    res.send(`<div>Phonebook has info for ${data.length} people</div> <br/> ${date}`)
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(404).json({
            error: 'Name and number are required'
        })
    }

    const personExist = data.find((person) => person.name === body.name)

    if (personExist) {
        return res.status(400).json({
            error: "Name already exist"
        })
    }

    const person = {
        name: body.name,
        number: body.number || 'Not number associated',
        id: Math.floor(Math.random() * 1000)
    }

    data = data.concat(person)
    res.json(person)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = data.find((person) => person.id === id)

    if (!person) {
        return res.status(404).end()
    }
    res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = data.find((person) => person.id === id)
    console.log(person)

    if (!person) {
        return res.status(404).send('Person id not found')
    }

    data = data.filter((person) => person.id !== id)
    res.json({ 'success': 'Person delete' })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})