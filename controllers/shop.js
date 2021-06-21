const Product = require('../models/product');

exports.getProducts = (req, res) => {
  //fetching the products using sequelize

  Product.findAll({where: {userId: req.user.id}})
    .then(products => {
      res.render('shop/product-list', {
        pageTitle: 'My Shop',
        path: '/products',
        prods: products,
      });
    })
    .catch(err => {
      console.log(err);
    })
}

// to get the particular product => product detail
exports.getProduct = (req, res) => {
  const productId = req.params.productId;

  // finding the product using the sequelize 

  Product.findByPk(productId)         // in sequelize findById is replace by findByPk
    .then(product => {
      res.render('shop/product-detail', {
        pageTitle: 'My Shop',
        path: '/products',
        product: product,
      });
    })
    .catch(err => {
      console.log(err);
    })
}

exports.getIndex = (req, res) => {
  //fetching the products using sequelize

  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        pageTitle: 'My Shop',
        path: '/',
        prods: products,
      });
    })
    .catch(err => {
      console.log(err);
    })
}

exports.postCart = (req, res) => {
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  // using sequelize
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(productId)

    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      })
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => {
      console.log(err);
    })
}

exports.getCart = (req, res) => {
  req.user.getCart()
    .then(cart => {
      return cart.getProducts()
        .then(products => {
          res.render('shop/cart', {
            pageTitle: 'My Shop',
            path: '/cart',
            products: products,
          });
        })
        .catch(err => {
          console.log(err);
        });
    }).catch(err => {
      console.log(err);
    });
}

exports.postCartDeleteProduct = (req, res) => {
  const productId = req.body.productId;

  // using sequelize to delete the cart item

  req.user.getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postOrder = (req, res) => {
  let fetchedCart;

  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts()
    })
    .then(products => {
      req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            }))
        })
        .catch(err => {
          console.log(err);
        })
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => {
      console.log(err);
    })
}

exports.getOrders = (req, res) => {
  req.user.getOrders({ include: ['products'] })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'My Shop',
        path: '/orders',
        orders: orders,
      });
    })
    .catch(err => console.log(err));
}