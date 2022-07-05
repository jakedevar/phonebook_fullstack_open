const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://jakedevar:${password}@cluster0.xkhalmx.mongodb.net/?retryWrites=true&w=majority`
const connection = mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
	Person.find({}).then(result => {
		result.forEach(person => console.log(person))
	}).then(() => mongoose.connection.close())
}

if (process.argv.length === 5) {
	connection.then(() => {
		const person = new Person({
			name: process.argv[3],
			number: process.argv[4],
		})

		return person.save()
		return mongoose.connection.close()
	}).then(() => {
		return mongoose.connection.close()
	}).catch(err => console.log(err))
}

