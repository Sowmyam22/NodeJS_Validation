const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const csrf = require('csurf'); // adding csrf protection
const flash = require('connect-flash'); // used to show the error messages

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

const store = new SequelizeStore({
  db: sequelize
});

var csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(
  {
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(csrfProtection); // should write this middleware only after the session iniitialization

app.use(flash()); // should be initialized only after the initialzation of the session

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findByPk(req.session.user.id)
    .then(user => {
      req.user = user;
      next()
    })
    .catch(err => console.log(err));
})

// middleware to check if logged in user is authenticated and adding the csrf protection for every request

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})

app.use('/admin', adminData.routes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

// sequelize.sync({ force: true })    // used to override the tables in the database
sequelize.sync()
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });

