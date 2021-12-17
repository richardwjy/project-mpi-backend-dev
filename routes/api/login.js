const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const axios = require('axios')


// const TOKEN_SECRET = "askjdhjkfkmwjkasdn"
// const LOGIN_API = ''

router.post('/', (req, res) => {
    const { username, password } = req.body
    // console.log(`${username}\\${password}`)
    if (!username || !password) return res.status(400).json({ message: "Username or Password is not provided" });
    // res.json({ username: username, password: password })
    axios.get(process.env.LOGIN_API + `"${username}"`, {
        auth: {
            username: username,
            password: password
        }
    }).then(response => {
        console.log("Logged in!")
        const token = jwt.sign({ _id: response.data.Resources[0].id, username, password }, process.env.TOKEN_SECRET)

        // res.header('auth-token', token)
        return res.status(response.status).json({ token, data: response.data.Resources })
    }).catch(error => {
        console.log(error.response.config.validateStatus())
        return res.status(error.response.status).json({ message: error.response.statusText })
    })
}
)

module.exports = router