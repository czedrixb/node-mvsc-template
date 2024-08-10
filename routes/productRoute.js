const express = require("express")
const router = express.Router()
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController')
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, getProducts)
router.get('/:id', verifyToken, getProduct)
router.post('/', verifyToken, createProduct)
router.put('/:id', verifyToken, updateProduct)
router.delete('/:id', verifyToken, deleteProduct)

module.exports = router