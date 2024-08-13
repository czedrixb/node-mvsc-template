const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')

const SECRET_KEY = process.env.SECRET_KEY

const register = asyncHandler(async (req, res) => {
    try {
        const user = new User(req.body);
        await user.validate();

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already taken' });
        }
        await user.save();
        res.status(201).json({ message: 'User registered successfully' })
    } catch (error) {
        throw new Error(error.message)
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
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
            expiresIn: '7d',
        });
        res.status(200).json({ token });
    } catch (error) {
        throw new Error(error.message)
    }
})

const logout = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
})

module.exports = {
    register,
    login,
    logout,
}