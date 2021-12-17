const express = require('express')

const Router = express.Router()

const loginRoutes = require('./api/login')
const invoiceRoutes = require('./api/invoices')

// LOV
const supplierRoutes = require('./api/suppliers')
const businessUnitRoutes = require('./api/businessunits')
const paymentTermRoutes = require('./api/paymentTerms')

Router.use('/login', loginRoutes)
Router.use('/invoices', invoiceRoutes)

// LOV (Master data, just Get value)
Router.use('/suppliers', supplierRoutes)
Router.use('/lovBusinessUnits', businessUnitRoutes)
Router.use('/paymentTerms', paymentTermRoutes)

module.exports = Router