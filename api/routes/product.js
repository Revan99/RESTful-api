const express = require("express")
const router = express.Router();
const mongoose = require("mongoose")
const Product = require('./../models/product')
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./upload/")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({
    storage: storage,
})

router.get('/', (req, res, next) => {

    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                }
                )
            }
            res.status(200).json(response)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ err })
        })
})

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    product.save()
        .then((result) => {
            console.log(result)
            res.status(201).json({
                message: 'Created product successfully',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    productImage: result.productImage
                }
            })
                .catch((err) => {
                    consol.log(err)
                    res.status(201).json({ error: err })
                })

        })
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId
    console.log(id);
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then((result) => {
            console.log("From database", result)
            if (result)
                res.status(200).json([result])
            else
                res.status(404).json({ message: "No valid entry found for providing ID" })

        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({ error: err })
        })
})
router.patch('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Product.findByIdAndUpdate({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    ulr: 'http://localhost:3000/products/' + result._id
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ err })
        })
})
router.delete('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    body: { name: 'String', price: 'Number' }
                }
            })
        })
        .catch(err => {
            res.status(500).json({ err })
        })
})
module.exports = router