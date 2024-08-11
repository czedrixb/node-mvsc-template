const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')

const SERCRET_KEY = process.env.SERCRET_KEY

const register = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ email, password: hashedPassword });
        console.log(user)
        // res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        const user = User.findOne({ email: req.body.email })
        if (user) {
            res.status(400).json({ messaage: 'Email is already taken' })
        } else {
            throw new Error(error.message)
        }
    }
})

const login = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jwt.sign({ userId: user._id }, SERCRET_KEY, {
            expiresIn: '1h',
        });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
})

module.exports = {
    register,
    login,
}