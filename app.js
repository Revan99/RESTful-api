const express = require('express')
const app = express()
const morgan = require('morgan')

const productRoutes = require('./api/routes/product')
const ordersRoutes = require('./api/routes/orders')

//login resquest
app.use(morgan("dev"))

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