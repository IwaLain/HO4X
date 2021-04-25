const User = require('../models/user')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token
        const decoded = jwt.verify(token, 'jopa')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) throw new Error()

        req.token = token
        req.user = user

        next()
    }
    catch (e) {
        res.status(401).send({ error: 'Need authorization.' })
    }
}

module.exports = auth