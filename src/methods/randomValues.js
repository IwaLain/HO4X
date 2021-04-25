const randomValues = (values, times) => {
    let randomizedValues = []

    for(let i=0; i < times; i++) {
        len = Math.floor(Math.random() * values.length)
        randomizedValues.push(values[len])
    }

    return randomizedValues
}

module.exports = randomValues