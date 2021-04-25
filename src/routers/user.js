const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../methods/auth')

// Статистика юзера
router.get('/api/user', auth, async (req, res) => {
    try {
        res.send(req.user)
    }
    catch (e) {
        res.status(500).send(e)
    }
})

// Регистрация юзера
router.post('/api/user', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.createAuthToken()

        res.status(201)
        .cookie('token', token, { httpOnly: true })
        .send({ user, token })
    }
    catch (e) {
        res.status(500).send(e)
    }
})

// Логин юзера
router.post('/api/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.createAuthToken()

        res.cookie('token', token, { httpOnly: true })
        .send({ user, token })
    }
    catch (e) {
        res.status(500).send(e)
    }
})

// Выход юзера
router.post('/api/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => { return token.token !== req.token })
        await req.user.save()

        res.clearCookie('token').send({ success: 'Successfully logout session.' })
    }
    catch (e) {
        res.status(500).send(e)
    }
})

// Выход со всех устройств
router.post('/api/user/logout/all', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send({ success: 'Successfully wipe all sessions.' })
    }
    catch (e) {

    }
})

// Обновление статистики
router.patch('/api/user/stats', auth, async (req, res) => {
    const stats = req.user.stats

    stats.wordsTyped += req.body.resWords
    stats.misspells += req.body.misspells
    stats.totalTime += req.body.resTime
    stats.charsTyped += req.body.charsTyped
    stats.cpm = Math.floor((stats.charsTyped / stats.totalTime) * 60)

    await req.user.save()
    res.send(req.user)
})
 
module.exports = router