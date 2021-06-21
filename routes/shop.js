const express = require('express');

const router = express.Router();

const adminData = require('./admin');
const {
  getIndex,
  getProducts,
  getProduct,
  postCart,
  getCart,
  postCartDeleteProduct,
  postOrder,
  getOrders
} = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

router.get('/', getIndex);

router.get('/products', getProducts);

// details page route
router.get('/products/:productId', getProduct);

router.post('/cart', isAuth, postCart);

router.get('/cart', isAuth, getCart);

router.post('/cart-delete-item', isAuth, postCartDeleteProduct);

router.post('/create-order', isAuth, postOrder);

router.get('/orders', isAuth, getOrders);

module.exports = router;