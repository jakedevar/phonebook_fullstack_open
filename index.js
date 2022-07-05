const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.static('build'))

let people = [
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

app.use(morgan('tiny'))

app.get("/api/persons", (req, res) => {
	console.log(people)
	res.json(people)
})

app.get("/info", (req, res) => {
	res.send(
	`<p>Phone book has info for ${people.length} ${people.length > 1 ? "persons" : "person"}</p>
	${new Date()}
		`)
})

app.get("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id)
	const person = people.find(people => people.id === id)
	if (person) {
		res.json(person)
	} else {
		res.status(404).end()
	}
})

app.delete("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id)
	const personsFiltered = people.filter(person => person.id !== id)
	if (personsFiltered) {
		people = personsFiltered
		res.status(200).end()
	} else {
		res.status(404).end()
	}
})

const generateId = () => {
	const number = Math.floor(Math.random() * (100 - people.length))
	return number
}

app.use(express.json())

morgan.token('body', function (req, res) { 
	return JSON.stringify(req.body )
})
//app.use(morgan((tokens, req, res) => {
//	return [
//		tokens.method(req, res),
//		tokens.url(req, res),
//		tokens.status(req, res),
//	  '-',
//		tokens.body(req, res)
//	]
//}))

app.post("/api/persons", (req, res) => {
	const body = req.body

	if (people.find(person => person.name === body.name)) {
		return res.status(400).json({
			error: "name must be unique"
		})
	}

	if (!body.name) {
		return res.status(404).json({
			error: 'content missing'
		})
	} 

	const person = {
		name: body.name,
		number: body.number,
		id: generateId()
	}
	people.push(person)
	res.json(people)
})

const unknownEndpoint = (req, res) => {
	res.status(400).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
