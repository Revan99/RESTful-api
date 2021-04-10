const express = require("express")
const router = express.Router();
const mongoose = require("mongoose")
const checkAuth = require("./../middleware/check-auth")
const Order = require("./../models/Orders")
const Product = require("./../models/product")
router.get('/', checkAuth, (req, res, next) => {
    Order.find()
        .select("product quantity _id")
        .populate('product', 'name _id')
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json([{
                count: result.length,
                orders: result.map(res => {
                    return {
                        _id: res._id,
                        product: res.product,
                        quantity: res.quantity,
                        request: {
                            type: "GET",
                            url: 'http://localhost:3000/orders/' + res._id
                        }
                    }
                })
            }])
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})
router.post('/', checkAuth, (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "product not found"
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            })
            return order.save()

        })
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: "Order Stored",
                createdOrder: {
                    _id: result._id,
                    quantity: result.quantity,
                    product: result.product
                },
                request: {
                    type: "GET",
                    url: 'http://localhost:3000/orders/' + result._id
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ err })
        })
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    })
    order.save()
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: "Order Stored",
                createdOrder: {
                    _id: result._id,
                    quantity: result.quantity,
                    product: result.product
                },
                request: {
                    type: "GET",
                    url: 'http://localhost:3000/orders/' + result._id
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ err })
        })
})
router.get('/:orderId', checkAuth, (req, res, next) => {
    const id = req.params.orderId
    Order.findById(id)
        .select('product quantity _id')
        .populate('product', 'name _id')
        .exec()
        .then((result) => {
            if (result)
                res.status(200).json({
                    order: result,
                    request: {
                        type: "GET",
                        url: 'http://localhost:3000/orders'
                    }
                })
            else
                res.status(404).json({ message: "Order not found" })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({ error: err })
        })
})
router.delete('/:orderId', checkAuth, (req, res, next) => {
    const id = req.params.orderId
    Order.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Order Deleted",
                request: {
                    type: "GET",
                    url: 'http://localhost:3000/orders',
                    body: {
                        ProductId: "ID", quantity: "Number"
                    }

                }
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({ error: err })
        })
})
module.exports = router