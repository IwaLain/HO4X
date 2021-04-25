const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    stats: {
        cpm: {
            type: Number,
            default: null
        },
        totalTime: {
            type: Number,
            default: 0
        },
        wordsTyped: {
            type: Number,
            default: 0
        },
        misspells: {
            type: Number,
            default: 0
        },
        charsTyped: {
            type: Number,
            default: 0
        }
    }
})

userSchema.methods.toJSON = function() {
    const user = this.toObject()

    delete user.password
    delete user.tokens

    return user
}

userSchema.methods.createAuthToken = async function() {
    const user = this

    const token = jwt.sign({ _id: user._id.toString() }, 'jopa')
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ username })
    if (!user) throw new Error('User not found.')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error('Password mismatch.')

    return user
}

userSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User