const mongoose = require('mongoose')

const url = 'mongodb://93.79.187.251:27017/ho4x'

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
