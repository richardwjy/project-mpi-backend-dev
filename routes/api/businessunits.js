const router = require('express').Router()
const axios = require('axios')
const verifyToken = require('./verifyToken')

const getUrl = (type) => {
    if (type == "BU") return process.env.BASE_API + `/fscmRestApi/resources${process.env.API_VERSION}${process.env.BU_SECURITY_API}`;
    if (type == "Master BU") return process.env.BASE_API + `/fscmRestApi/resources${process.env.API_VERSION}${process.env.LOV_BU_API}`;
}

router.post('/', verifyToken, (req, res) => {
    console.log('Get businessUnits from dataSecurity and finBusinessUnitsLOV 2 Steps');
    // console.log(req.user.username)
    const { Userrf, Rolerf } = req.body;
    console.log(req.body)
    if (!Userrf || !Rolerf) return res.status(400).json({ message: "Userrf or Rolerf is not provided" })
    axios.get(getUrl("BU") + `Userrf="${Userrf}",Rolerf="${Rolerf}"`, {
        auth: {
            ...req.user
        }
    }).then(responseBu => {
        console.log('Step 1 - Finish getting BU from dataSecurities')
        const dataBu = responseBu.data.items.filter(item => item.SecurityContext == "Business unit")

        console.log('Get businessUnits from finBusinessUnitsLOV')
        axios.get(getUrl("Master BU"), {
            auth: {
                ...req.user
            },
            params: {
                onlyData: true
            }
        }).then(responseMsBu => {  //MsBu = Master Business Unit 
            console.log('Step 2 - Finish getting Master BU from finBusinessUnitsLOV')
            const dataMsBu = responseMsBu.data.items
            let joinedBu = []

            for (let i = 0; i < dataBu.length; i++) {
                if (dataBu[i].SecurityContextValue) {
                    joinedBu.push({
                        ...dataBu[i],
                        ...(dataMsBu.find(item => item.BusinessUnitName == dataBu[i].SecurityContextValue))
                    })
                }
            }
            return res.status(responseMsBu.status).json({ data: joinedBu })
        })
    })

    // 10-Dec-2021
    // Comment sementara
    // axios.get(process.env.BASE_API + `/fscmRestApi/resources/11.13.18.05/finBusinessUnitsLOV`, {
    //     auth: {
    //         ...req.user
    //     }
    // }).then(responseBusUnits => {
    //     console.log('Step 1 - Finish getting from /finBusinessUnitsLOV Fusion');
    //     axios.get(process.env.BASE_API + `/fscmRestApi/resources/11.13.18.05/legalEntitiesLOV`, {
    //         auth: {
    //             ...req.user
    //         }
    //     }).then(responseLegalEntity => {
    //         console.log('Step 2 - Finish getting from /legalEntitiesLOV Fusion');
    //         let busUnits = responseBusUnits.data.items;
    //         let legalEntity = responseLegalEntity.data.items;

    //         if (busUnits.length == 0 || legalEntity.length == 0) return res.json({ message: `No data available` })

    //         let joinedLegalUnits = []

    //         for (let i = 0; i < busUnits.length; i++) {
    //             if (busUnits[i].LocationId) {
    //                 joinedLegalUnits.push({
    //                     ...busUnits[i],
    //                     ...(legalEntity.find(item => item.LegalEntityId == busUnits[i].LegalEntityId))
    //                 })
    //             }
    //         }
    //         // console.log(joinedLegalUnits[1])
    //         return res.status(responseLegalEntity.status).json({ data: joinedLegalUnits })
    //     })

    //     // return res.status(response.status).json({ data: response.data.items })
    // }).catch(error => {
    //     console.log(error)
    //     return res.status(error.response.status).json({ message: error.response.statusText })
    // })
    // res.json({ invoices: { _id: req.params["id"], invoice_name: "Random invoice item" } });
});

module.exports = router