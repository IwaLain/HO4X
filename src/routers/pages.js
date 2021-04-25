const express = require('express')
const router = new express.Router()

router.get('', (req, res) => {
    res.render('index', {
        title: 'HO4X'
    })
})

router.get('/words_ru', (req, res) => {
    res.render('trainer_ru', {
        title: 'HO4X: Русские слова'
    })
})

router.get('/words_en', (req, res) => {
    res.render('trainer_en', {
        title: 'HO4X: Английские слова'
    })
})

router.get('/register', (req, res) => {
    res.render('register', {
        title: 'HO4X: Регистрация'
    })
})

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'HO4X: Вход'
    })
})

router.get('*', (req, res) => {
    res.render('404', {
        title: 'HO4X'
    })
})

module.exports = router