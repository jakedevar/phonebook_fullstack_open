const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url)
.then(res => console.log('connected to MongoDB'))
.catch(err => console.log('error connecting to MongoDB: ', err))

const peopleSchema = new mongoose.Schema({
	name: String,
	number: String
})

peopleSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})


module.exports = mongoose.model('People', peopleSchema)
