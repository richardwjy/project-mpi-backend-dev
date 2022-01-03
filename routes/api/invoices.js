const router = require('express').Router()
const axios = require('axios')
const verifyToken = require('./verifyToken')

const { invoiceSchema } = require('../../helpers/validationSchema')

const getUrl = (type) => {
    if (type == "currency") return process.env.BASE_API + `/fscmRestApi/resources${process.env.API_VERSION}${process.env.CURRENCY_API}`;
    if (type == "invoice") return process.env.BASE_API + `/fscmRestApi/resources${process.env.API_VERSION}${process.env.INVOICE_API}`;
}

router.get('/', verifyToken, (req, res) => {
    console.log('Get all invoices');
    // console.log(req.user.username)
    const { username, password } = req.user;
    axios.get(getUrl("invoice"), {
        auth: {
            username: username,
            password: password
        }
    }).then(response => {
        console.log('Finish getting from /invoices Fusion');
        return res.status(response.status).json({ data: response.data.items })
    }).catch(error => {
        console.log(error)
        return res.status(error.response.status).json({ message: error.response.statusText })
    })
    // res.json({ invoices: { _id: req.params["id"], invoice_name: "Random invoice item" } });
});

router.get('/currency', verifyToken, async (req, res) => {
    console.log('Get currency list');
    try {
        const response = await axios.get(getUrl("currency"), {
            auth: {
                ...req.user
            },
            params: {
                onlyData: true,
                totalResults: true,
                limit: 300,
                offset: 0
            }
        })
        return res.status(response.status).json({ data: response.data.items, totalData: response.data.totalResults })
    } catch (error) {
        return res.status(error.response.status).json({ message: error.response.statusText })
    }
})

router.get('/:id', verifyToken, (req, res) => {
    // console.log(req.user.username)
    res.json({ invoices: { _id: req.params["id"], invoice_name: "Random invoice item" } });
});

router.post('/', verifyToken, async (req, res, next) => {
    try {
        console.log("Validating Invoice object");
        const result = await invoiceSchema.validateAsync(req.body);
        // return res.json({ invoice: result });
    } catch (err) {
        if (err.isJoi === true) err.status = 422
        return res.json({ errMsg: err.details[0].message })
    }
    try {
        console.log("Posting invoice to Oracle Fusion");
        const result = await axios({
            method: 'post',
            url: getUrl("invoice"),
            auth: {
                username: req.user.username,
                password: req.user.password
            },
            data: {
                ...req.body
            }
        })
        return res.json({ data: result.data });
    } catch (error) {
        console.log("Error Occured while POST Invoice to Fusion")
        console.log(error.response.data)
        return res.status(error.response.status).json({ message: error.response.data })
    }
})

module.exports = router