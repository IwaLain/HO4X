const express = require('express')
const router = new express.Router()
const Words = require('../models/words')
const randomValues = require('../methods/randomValues')

// Случайные 50 слов на языке
router.get('/api/words/:lang', async (req, res) => {
    try {
        const words = await Words.findOne({ lang: req.params.lang })
        if (!words) {
            return res.status(404).send({ error: 'Words for specified language are not found.' })
        }

        const randomizedWords = randomValues(words.words, 50)
        res.send(randomizedWords)
    }
    catch (e) {
        res.status(500).send({ error: e })
    }
})



// Создание словаря для нового языка
router.post('/api/words', async (req, res) => {
    const words = new Words(req.body)
    try {
        await words.save()
        res.status(201).send(words)
    }
    catch(e) {
        res.status(500).send({ error: e })
    }
})

// Вставка новых слов в словарь
router.patch('/api/words/:lang', async (req, res) => {
    try {
        const words = await Words.findOne({ lang: req.params.lang })
        if (!words) {
            return res.status(404).send({ error: 'Words for specified language are not found.' })
        }

        const wordsToInsert = req.body.file
        // Тут должен быть апдейт по байнери тхт файлу
    }
    catch (e) {
        res.status(500).send({ error: e })
    }
})

module.exports = router