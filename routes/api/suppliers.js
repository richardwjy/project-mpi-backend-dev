const router = require('express').Router()
const axios = require('axios')
const verifyToken = require('./verifyToken')

const getUrl = () => {
    return process.env.BASE_API + `/fscmRestApi/resources${process.env.API_VERSION}${process.env.SUPPLIER_API}`;
}

router.get('/', verifyToken, (req, res) => {
    console.log('Get all suppliers');
    axios.get(getUrl(), {
        auth: {
            ...req.user
        },
        params: {
            onlyData: true,
            totalResults: true,
            limit: 5,
            offset: 0
        }
    }).then(response => {
        console.log('Finish getting from /suppliers Fusion');
        let resData = response.data.items;
        return res.status(response.status).json({ data: resData, totalResults: response.data.totalResults })
    }).catch(error => {
        console.log(error)
        return res.status(error.response.status).json({ message: error.response.statusText })
    })
});

router.post('/search/:business_unit_id', verifyToken, async (req, res) => {
    console.log(`Get suppliers like: ${req.body.query}`);

    if (!req.params["business_unit_id"]) {
        return res.status(400).json({ message: "BusinessUnitId is needed for this request" })
    }

    query = req.body.query ? req.body.query : "%"
    BusUnitId = req.params["business_unit_id"]
    try {
        const result = await axios.get(getUrl() + `?q=SupplierName LIKE "${query}"&finder=FindByBillToBU;BillToBuId="${BusUnitId}"`, {
            auth: {
                ...req.user
            },
            params: {
                onlyData: true,
                totalResults: true,
                limit: 10,
                offset: 0
            }
        })
        return res.json({ data: result.data.items, totalResults: result.data.totalResults })
    } catch (error) {
        console.log(error)
        return res.status(error.response.status).json({ message: error.response.statusText })
    }
})

router.get('/sites/:supplier_id/:business_unit', verifyToken, async (req, res) => {
    if (!req.params["supplier_id"]) return res.status(400).json({ message: "Please provide supplier_id" })
    if (!req.params["business_unit"]) return res.status(400).json({ message: "Please provide business_unit after supplier_id" })
    console.log(`Get supplier sites of supplier_id: ${req.params["supplier_id"]}`)
    try {
        const response = await axios.get(getUrl() + `/${req.params["supplier_id"]}/child/sitesLOV`, {
            auth: {
                ...req.user
            },
            params: {
                onlyData: true,
                totalResults: true,
                limit: 5,
                offset: 0
            }
        })
        console.log(response.data.items);
        let sitesData = response.data.items.filter(item => item.ProcurementBU.toLowerCase() == req.params["business_unit"].toLowerCase())
        return res.status(response.status).json({ data: sitesData, totalData: response.data.totalResults })
    } catch (error) {
        return res.status(error.response.status).json({ message: error.response.statusText })
    }
})

module.exports = router