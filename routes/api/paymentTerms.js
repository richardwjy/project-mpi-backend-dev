const router = require('express').Router()
const axios = require('axios')
const verifyToken = require('./verifyToken')

router.get('/', verifyToken, (req, res) => {
    console.log('Get payment terms')
    axios.get(process.env.BASE_API + '/fscmRestApi/resources/11.13.18.05/payablesPaymentTerms', {
        auth: {
            ...req.user
        }
    }).then(response => {
        console.log('Finish getting from /payablesPaymentTerms Fusion');
        // response.data.items.forEach(x => console.log(x.name));
        return res.status(response.status).json({ data: response.data.items });
    }).catch(error => {
        console.log(error)
        return res.status(error.response.status).json({ message: error.response.statusText })
    })
})

module.exports = router