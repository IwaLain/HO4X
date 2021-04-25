const path = require('path')
const express = require('express')
require('../src/db/mongoose')
const hbs = require('hbs')
const pageRouter = require('./routers/pages')
const wordsRouter = require('./routers/words')
const userRouter = require('./routers/user')
const cookieParser = require('cookie-parser')

const app = express()
const port = process.env.PORT || 25565

const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
app.use(express.static(publicPath))
app.use(cookieParser())

app.use(express.json())

app.use(wordsRouter)
app.use(userRouter)
app.use(pageRouter)

app.listen(port, () => {
    console.log(`Started on ${port}.`)
})