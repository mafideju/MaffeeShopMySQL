const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const db = require('./utils/database');

// db.execute('SELECT * FROM products')
//   .then(data => console.log('DB DATA =>', data))
//   .catch(err => console.log('DB ERR => ', err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs')
app.set('views', 'views');

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404)

app.listen(7001);
