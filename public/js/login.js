const loginBtn = document.getElementById('login-user')
const loginUsername = document.getElementById('login-username')
const loginPassword = document.getElementById('login-password')



loginBtn.addEventListener('click', async () => {
    if (loginUsername.value.length < 3) {
        return errorShake(loginUsername)
    }
    if (loginPassword.value.length < 6) {
        return errorShake(loginPassword)
    }
    
    await axios.post('/api/user/login', { username: loginUsername.value, password: loginPassword.value })
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