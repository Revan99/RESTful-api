const express = require("express")
const router = express.Router();
const mongoose = require("mongoose")
const Product = require('./../models/product')

router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({err})
        })
})

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })
    product.save()
        .then((result) => {
            console.log(result)
            res.status(201).json({
            message: 'handling POST request to /products',
            createdProduct: result
        })
                .catch((err) => {
                    consol.log(err)
                    res.status(201).json({error: err})
                })
        
    })
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId
    console.log(id);
    Product.findById(id)
        .exec()
        .then((result) => {
            console.log("From database", result)
            if (result)
                res.status(200).json(result)
            else
                res.status(404).json({message: "No valid entry found for providing ID"})
                
        })
        .catch((err) => {     
            console.log(err)
            res.status(500).json({error: err})
        })
})
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Product.findByIdAndUpdate({ _id: id }, { $set: updateOps }).exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({err})
        })
})
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({err})
        })
})
module.exports = router