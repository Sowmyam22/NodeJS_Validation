const Product = require('../models/product');
const User = require('../models/user');

// get the product form
exports.getAddProduct = (req, res) => {
  // restricting the access of the route 
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }

  // only logged-in user can access this route
  res.render('admin/edit-product', {
    pageTitle: 'My Shop',
    path: '/admin/add-product',
    editing: false,
  });
};

// add product 
exports.postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body;

  req.user.createProduct({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
  })
    .then(result => {
      console.log("Created Product");
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    })
};

// get the edit product form
exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/');
  }

  const productId = req.params.productId;

  req.user.getProducts({ where: { id: productId } })
    .then(products => {       // if no relation we use findByPk and fetch the single product
      const product = products[0];    // only if we get multiple products
      if (!product) {
        res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'My Shop',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
      });
    })
    .catch(err => {
      console.log(err);
    })

};

exports.postEditProduct = (req, res) => {
  const { productId, title, imageUrl, price, description } = req.body;

  // using sequelize to update the product details

  Product.findByPk(productId)
    .then(product => {
      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;

      return product.save();   // sequelize provides save() method to update the details in the database
    })
    .then(result => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    })
}

// To get admin products along with edit and delete functionality
exports.getProducts = (req, res) => {
  // using sequelize to fetch the products

  // Product.findAll()
  req.user.getProducts()
    .then(products => {
      res.render('admin/products', {
        pageTitle: 'My Shop',
        path: '/admin/products',
        prods: products,
      });
    })
    .catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res) => {
  const productId = req.body.productId;

  Product.findByPk(productId)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    })
}