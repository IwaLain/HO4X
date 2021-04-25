const lang = window.location.pathname.slice(-2)

const statsUsername = document.getElementById('stats-username')
const statsCPM = document.getElementById('stats-cpm')
const statsTime = document.getElementById('stats-time')
const statsWords = document.getElementById('stats-words')
const statsMisspells = document.getElementById('stats-misspells')

const inputCursor = document.getElementById('input-cursor')
const printedField = document.getElementById('printed-field')
const unprintedField = document.getElementById('unprinted-field')
const inputField = document.getElementById('input-field')

const fieldWidth = getComputedStyle(inputField).width
const buffer = Math.floor(fieldWidth.slice(0, -2) / 17)

const startBtn = document.getElementById('challenge-start')
const againBtn = document.getElementById('challenge-again')
const stopBtn = document.getElementById('challenge-stop')

const resModal = document.getElementById('res-modal')
const resWordsTyped = document.getElementById('res-words-typed')
const resMisspells = document.getElementById('res-misspells')
const resTime = document.getElementById('res-time')
const resCPM = document.getElementById('res-cpm')
const resAgainBtn = document.getElementById('res-again-btn')
const resOKBtn = document.getElementById('res-ok-btn')

const gameTime = document.getElementById('game-time')
const gameCPM = document.getElementById('game-cpm')
let game = false
let words
let gameStopwatch
let i = 0
let seconds = 0
let minutes = 0
let cpm = 0
let inSeconds = 0
let correctChars = 0
let misspells = 0



if (localStorage.getItem('session')) {
    let mins = Math.round(localStorage.getItem('totalTime') / 60)
    let seconds = localStorage.getItem('totalTime') % 60
    
    if (seconds < 10) statsTime.textContent = `${mins}:0${seconds}`
    else statsTime.textContent = `${mins}:${seconds}`
    statsUsername.textContent = localStorage.getItem('username')
    statsCPM.textContent = localStorage.getItem('cpm')
    statsWords.textContent = localStorage.getItem('words')
    statsMisspells.textContent = localStorage.getItem('misspells')
}


document.addEventListener('keydown', (e) => {
    if (!game) return

    let btn = document.getElementById(e.code)
    let nextLetter = unprintedField.textContent[0]

    btn.style.backgroundColor = 'var(--reject)'
    
    if (e.key === nextLetter) {
        correctChars++
        unprintedField.textContent = unprintedField.textContent.slice(1)
        printedField.textContent += nextLetter
    } 
    else {
        misspells++
        errorShake(inputField)
    }
})

document.addEventListener('keyup', async (e) => {
    if (!game) return

    let btn = document.getElementById(e.code)

    btn.style.backgroundColor = 'white'

    if (unprintedField.textContent.length <= 0) {
        if (i >= 50) {
            btn.style.backgroundColor = 'white'
            return gameEnd()
        }

        printedField.textContent = ''
        while (unprintedField.textContent.length < buffer && i < 50) {
            unprintedField.textContent += words.data[i] + ' '
            i++
        }
    }
})

startBtn.addEventListener('click', () => {
    gameStart()
})

againBtn.addEventListener('click', () => {
    gameEnd()
    gameStart()
})

stopBtn.addEventListener('click', () => {
    gameEnd()
})

resAgainBtn.addEventListener('click', () => {
    resModal.classList.remove('showModal')
    gameStart()
})

resOKBtn.addEventListener('click', () => {
    resModal.classList.remove('showModal')
})



const gameStart = async () => {
    startBtn.style.display = 'none'
    againBtn.style.display = 'inline-block'
    stopBtn.style.display = 'inline-block'
    inputCursor.style.display = 'inline-block'
    printedField.textContent = ''
    game = true

    await getWords()
    startStopwatch()
}

const gameEnd = async () => {
    let resWords
    if (unprintedField.textContent.length === 0) resWords = i
    else resWords = i - unprintedField.textContent.trim().split(' ').length
    resWordsTyped.textContent = resWords
    resMisspells.textContent = misspells
    if (seconds < 10) resTime.textContent = `${minutes}:0${seconds}`
    else resTime.textContent = `${minutes}:${seconds}`
    resCPM.textContent = Math.floor(cpm)
    resModal.classList.add('showModal')

    if (localStorage.getItem('session')) {
        const res = await axios.patch('/api/user/stats', { resWords, misspells, resTime: inSeconds, cpm })
        localStorage.setItem('cpm', res.data.stats.cpm)
        localStorage.setItem('words', res.data.stats.wordsTyped)
        localStorage.setItem('misspells', res.data.stats.misspells)
        localStorage.setItem('totalTime', res.data.stats.totalTime)
        
        let mins = Math.round(localStorage.getItem('totalTime') / 60)
        let seconds = localStorage.getItem('totalTime') % 60
        
        if (seconds < 10) statsTime.textContent = `${mins}:0${seconds}`
        else statsTime.textContent = `${mins}:${seconds}`
        statsUsername.textContent = localStorage.getItem('username')
        statsCPM.textContent = localStorage.getItem('cpm')
        statsWords.textContent = localStorage.getItem('words')
        statsMisspells.textContent = localStorage.getItem('misspells')
    }

    clearInterval(gameStopwatch)
    startBtn.style.display = 'inline-block'
    againBtn.style.display = 'none'
    stopBtn.style.display = 'none'
    inputCursor.style.display = 'none'
    printedField.textContent = 'Нажмите Старт! чтобы начать...'
    unprintedField.textContent = ''
    gameTime.textContent = '0:00'
    gameCPM.textContent = '0'
    game = false
    i = 0
    seconds = 0
    minutes = 0
    inSeconds = 0
    cpm = 0
    misspells = 0
    correctChars = 0
}

const getWords = async () => {
    words = await axios(`/api/words/${lang}`)

    while (unprintedField.textContent.length < buffer) {
        unprintedField.textContent += words.data[i] + ' '
        i++
    }
}

const startStopwatch = () => {
    gameStopwatch = setInterval(() => {
        if (seconds < 59) seconds++
        else {
            seconds = 0
            minutes++
        }

        if (seconds < 10) gameTime.textContent = `${minutes}:0${seconds}`
        else gameTime.textContent = `${minutes}:${seconds}`

        inSeconds++

        cpm = (correctChars/inSeconds) * 60
        gameCPM.textContent = Math.round(cpm)
    }, 1000)
}

const errorShake = (el) => {
    el.animate([
        { border: '1px solid var(--reject)', boxShadow: '0 0 10px var(--reject)' },
        { transform: 'translateX(3px)' },
        { transform: 'translateY(-3px)' },
        { transform: 'translateX(3px)' },
        { transform: 'translateY(-3px)' },
        { border: '1px solid rgba(255, 255, 255, 0.4)' }
    ], 300)
}