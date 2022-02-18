import express from 'express'
import expressAsyncHandler from 'express-async-handler'
const productRouter = express.Router()
import Product from '../models/productModel.js'
import { isAdmin, isAuth } from '../utils.js'


productRouter.get('/', expressAsyncHandler(async (req, res) => {
    const pageSize = 9
    const page = Number(req.query.pageNumber) || 1
    const name = req.query.name || ''
    const category = req.query.category || ''
    const order = req.query.order || ''
    const min = req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0
    const max = req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0
    const rating = req.query.rating && Number(req.query.rating) !== 0 ? Number(req.query.rating) : 0
    const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {}
    const categoryFilter = category ? { category } : {}
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {}
    const ratingFilter = rating ? { rating: { $gte: rating } } : {}
    const sortOrder = order === 'lowest' ? { price: 1 } :
        order === 'highest' ? { price: -1 } :
            order === 'toprated' ? { rating: -1 } :
                { _id: -1 }
    const count = await Product.count({ ...nameFilter, ...categoryFilter, ...priceFilter, ...ratingFilter })
    const products = await Product.find({ ...nameFilter, ...categoryFilter, ...priceFilter, ...ratingFilter })
        .sort(sortOrder)
        .skip(pageSize * (page - 1))
        .limit(pageSize)
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
}))
productRouter.get('/categories', expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category')
    res.send(categories)
}))
productRouter.get('/top', expressAsyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(6) //limit for number products
    res.json(products)
}))

productRouter.post('/:id/reviews', isAuth, expressAsyncHandler(async (req, res) => {
    const { rating, comment } = req.body
    const product = await Product.findById(req.params.id)
    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        )

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Product already reviewed' })
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        }

        product.reviews.push(review)

        product.numReviews = product.reviews.length

        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length

        await product.save()
        return res.status(201).json({ message: 'Review added' })

    } else {
        return res.status(404).send({ message: "Product not found" })
    }
})
)

productRouter.get('/:id', expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        res.send(product)
    } else {
        res.status(404).send({ message: "Product not found" })
    }
}))
productRouter.post('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/p1.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
    })
    const createdProduct = await product.save()
    res.status(201).json({ message: 'Product Created', product: createdProduct })
}))

productRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        product.name = req.body.name
        product.price = req.body.price
        product.image = req.body.image
        product.brand = req.body.brand
        product.category = req.body.category
        product.countInStock = req.body.countInStock
        product.description = req.body.description
        product.rating= req.body.rating
        product.numReviews= req.body.numReviews
        const updatedProduct = await product.save()
        res.json({ message: "Product updated", product: updatedProduct })
    } else {
        res.status(404).send({ message: "Product not found" })
    }
}))

productRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        const deleteProduct = await product.remove()
        res.status(200).json({ message: 'Product Deleted', product: deleteProduct })
    } else {
        res.status(404).send({ message: 'Product Not Found' })
    }
}))

export default productRouter
