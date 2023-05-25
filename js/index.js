import {save} from './localstorage.js'
/**@type {HTMLFormElement} */
const form = document.querySelector('.login_div')


form.addEventListener('submit', function (e) {
    e.preventDefault()
    const username = new FormData(this).get('username')
    console.log(username)
    save('U', username)
    window.location = '../room.html'
})
