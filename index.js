require('dotenv').config()
const People = require('./models/people')
const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.static('build'))
app.use(morgan('tiny'))

app.get("/api/persons", (req, res) => {
	People.find({}).then(people => res.json(people))
})

app.get("/info", (req, res) => {
	res.send(
	`<p>Phone book has info for ${people.length} ${people.length > 1 ? "persons" : "person"}</p>
	${new Date()}
		`)
})

app.get("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id)
	const person = People.findById(id).then(note => note)
	if (person) {
		res.json(person)
	} else {
		res.status(404).end()
	}
})

app.delete("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id)
	const personsFiltered = People.findById(id).then(note => note)
	if (personsFiltered) {
		res.status(200).end()
	} else {
		res.status(404).end()
	}
})

// const generateId = () => {
// 	const number = Math.floor(Math.random() * (100 - people.length))
// 	return number
// }

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

	if (!body.name) {
		return res.status(404).json({
			error: 'content missing'
		})
	}

	const person = new People({
		name: body.name,
		number: body.number,
	})

	person.save().then(savedPerson => {
		res.json(savedPerson)
	})
})

const unknownEndpoint = (req, res) => {
	res.status(400).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
