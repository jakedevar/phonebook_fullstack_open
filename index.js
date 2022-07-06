require('dotenv').config()
const People = require('./models/people')
const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.static('build'))
app.use(morgan('tiny'))
app.use(express.json())

const errorHandler = (error, req, rew, next) => {
	console.log(error.message)

	if (error.name === 'CastError') {
		return res.status(400).send({error: "malformated id"})
	}

	next(error)
}

app.use(errorHandler)

app.get("/api/persons", (req, res) => {
	People.find({}).then(people => res.json(people))
})

app.get("/info", async (req, res, next) => {
	const people = await People.find({}).then(people => people).catch(err => next(err))
	res.send(
	`<p>Phone book has info for ${people.length} ${people.length > 1 ? "persons" : "person"}</p>
	${new Date()}
		`)
})

app.get("/api/persons/:id", (req, res, next) => {
	const id = req.params.id
	People.findById(id).then(person => {
		res.json(person)
	}).catch(err => next(err))
})

app.delete("/api/persons/:id", (req, res, next) => {
	const id = req.params.id
	console.log(id)
	People.findByIdAndRemove(id)
		.then(_ => {
			return res.status(204).end()
		}).catch(err => 
			next(err)
		)
})

app.put("/api/persons/:id", (req, res, next) => {
	const body = req.body
	const id = req.params.id

	const person = {
		name: body.name,
		number: body.number
	}

	People.findByIdAndUpdate(id, person, {new: true})
		.then(updatedPerson => {
			res.json(updatedPerson)
		}).catch(err => next(err))
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
