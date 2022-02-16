import express from 'express'
const userRouter = express.Router()
import expressAsyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import User from '../models/userModel.js'
import generateToken, { isAuth, isAdmin } from '../utils.js'

userRouter.get('/:id', expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        res.send(user)
    } else {
        res.status(404).send({ message: 'User Not Found' })
    }
}))
userRouter.post('/signin', expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user)
            })
            return
        }
    }
    res.status(401).send({ message: "Invalid email or password" })
}))

userRouter.post('/register', expressAsyncHandler(async (req, res) => {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
        res.status(401).send({ message: "User with current email existed" })
    } else {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password),
        })
        const createdUser = await user.save()
        res.send({
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            isAdmin: createdUser.isAdmin,
            token: generateToken(createdUser)
        })
    }
}))

userRouter.put('/profile', isAuth, expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name
        if (req.body.email) {
            const emailExist = await User.findOne({ email: req.body.email })
            if (!emailExist || emailExist.id.toString() === req.user._id) {
                user.email = req.body.email || user.email
            } else {
                return res.status(401).send({ message: "User with current email existed" })
            }
        }
        if (req.body.password) {
            user.password = bcrypt.hashSync(req.body.password)
        }
        const updatedUser = await user.save()
        res.send({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser)
        })
    }
}))

userRouter.get('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const user = await User.find({})
    res.send(user)
}))

userRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        if (user.email === 'admin@example.com') {
            res.status(400).send({ message: 'Can Not Delete Admin User' })
            return
        }
        const deleteUser = await user.remove()
        res.json({ message: 'User Deleted', user: deleteUser })
    } else {
        res.status(404).send({ message: 'User Not Found' })
    }
}))

userRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        if (user.email === 'admin@example.com') {
            res.status(400).send({ message: 'Can Not Update Admin User' })
            return
        }
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isSeller = req.body.isSeller || user.isSeller
        user.isAdmin = req.body.isAdmin || user.isAdmin
        const updatedUser= await user.save()
        res.json({ message: 'User Updated', user: updatedUser })
    } else {
        res.status(404).send({ message: 'User Not Found' })
    }
}))

export default userRouter