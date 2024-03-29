const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
// const db = require('./utils/database');
const sequelize = require('./utils/database')

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');


// db.execute('SELECT * FROM products')
//   .then(data => console.log('DB DATA =>', data))
//   .catch(err => console.log('DB ERR => ', err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404)

// Associações
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });


sequelize.sync({ force: true })
  .then(data => {
    return User.findByPk(1);
    // console.log('Sequelize Data', data);
  })
  .then(user => {
    if (!user) {
      return User.create({
        name: 'Marcio Mafideju',
        email: 'mafideju@outlook.com'
      });
    }
    return user;
  })
  .then(user => {
    // console.log('User', user);
    return user.createCart();
  })
  .then(() => {
    app.listen(7001);
  })
  .catch(err => console.log('Sequelize Sync', err));

