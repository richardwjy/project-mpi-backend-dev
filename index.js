const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')

const PORT = process.env.PORT || 5000

dotenv.config()

const corsOptions = {
    allowedHeaders: ['Authorization']
}

app.use(express.json())
app.use(cors(corsOptions))

// app.get('/', (req, res) => {
//     res.send('Welcome to original page')
// })

// app.use('/api/login', require('./routes/api/login'))
// app.use('/api/invoices', require('./routes/api/invoices'))
// app.use('/api/suppliers', require('./routes/api/suppliers'))
// app.use('/api/lovBusinessUnits', require('./routes/api/businessunits'))
// app.use('/api/paymentTerms', require('./routes/api/paymentTerms'))

const routes = require('./routes/routes')
app.use('/api', routes)

// Error 404 page
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/error404.html')
    // res.redirect('http://localhost:3001')
})

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)
})