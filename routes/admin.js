const express = require('express');

const { body } = require('express-validator/check');

const router = express.Router();

const {
  getAddProduct,
  getProducts,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct
} = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const products = [];

// /admin/add-product => GET
router.get('/add-product', isAuth, getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, getProducts);

// /admin/add-product => POST
router.post('/add-product',
  [
    body('title', 'Please enter valid title!')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('imageUrl', 'Please enter valid URL!')
      .isURL(),
    body('price', 'Please enter valid price!')
      .isFloat(),
    body('description', 'Please enter valid description!')
      .isLength({ min: 5, max: 400 })
      .trim()
  ], isAuth, postAddProduct);

// /admin/edit-product => GET
router.get('/edit-product/:productId', isAuth, getEditProduct);

// /admin/edit-product => POST
router.post('/edit-product',
  [
    body('title', 'Please enter valid title!')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('imageUrl', 'Please enter valid URL!')
      .isURL(),
    body('price', 'Please enter valid price!')
      .isFloat(),
    body('description', 'Please enter valid description!')
      .isLength({ min: 5, max: 400 })
      .trim()
  ], isAuth, postEditProduct);

// /admin/delete-product => POST
router.post('/delete-product', isAuth, postDeleteProduct);

exports.routes = router;
exports.products = products;