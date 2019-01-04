const uuid = require('uuid');

const Cart = require('./cart');
const db = require('../utils/database');

class Product {
  constructor(id, title, image, price, description) {
    this.id = id;
    this.title = title;
    this.image = image;
    this.price = price;
    this.description = description;
  }

  save() {
    return db.execute('INSERT INTO products (title, image, price, description) VALUES (?,?,?,?)',
      [this.title, this.image, this.price, this.description]
    );
  }

  static delete(id) {

  }

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static findById(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  }
}

module.exports = Product;