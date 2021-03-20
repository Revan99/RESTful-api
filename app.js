const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const productRoutes = require('./api/routes/product')
const ordersRoutes = require('./api/routes/orders')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb+srv://Revan99:'+ process.env.MONGO_ATLAS_PW +'@cluster0.78v5t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useMongoClient: true})
//login resquest
app.use(morgan("dev"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    //res.header('Access-Control-Allow-Header', 'Origin, X-Request-with, Content-Type, accept, Authorization')
    res.header('Access-Control-Allow-Header', '*')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST, PUT, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next();
})
//Routes which should handel reqests
app.use('/products', productRoutes)
app.use('/orders', ordersRoutes)

app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404;
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app