const mongoose = require('mongoose')

const wordsSchema = new mongoose.Schema({
    lang: {
        type: String,
        required: true
    },
    words: Array
})

const Words = mongoose.model('Words', wordsSchema)

module.exports = Words