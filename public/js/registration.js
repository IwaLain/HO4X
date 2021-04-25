const regBtn = document.getElementById('reg-user')
const regUsername = document.getElementById('reg-username')
const regPassword = document.getElementById('reg-password')



regBtn.addEventListener('click', async () => {
    if (regUsername.value.length < 3) {
        return errorShake(regUsername)
    }
    if (regPassword.value.length < 6) {
        return errorShake(regPassword)
    }

    await axios.post('/api/user', { username: regUsername.value, password: regPassword.value })
    await axios('/api/user')
    .then(res => {
        localStorage.setItem('session', true)
        localStorage.setItem('username', res.data.username)
        localStorage.setItem('cpm', res.data.stats.cpm)
        localStorage.setItem('words', res.data.stats.wordsTyped)
        localStorage.setItem('misspells', res.data.stats.misspells)
        localStorage.setItem('totalTime', res.data.stats.totalTime)
    })
    .then(() => {
        window.location = '/'
    })
})


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