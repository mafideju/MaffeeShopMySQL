const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const uuid = require('uuid');

const savePath = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = (callback) => {
  fs.readFile(savePath, (err, data) => {
    if (err) return callback([]);
    callback(JSON.parse(data));
  });
}

class Product {
  constructor(id, title, image, price, description) {
    this.id = id;
    this.title = title;
    this.image = image;
    this.price = price;
    this.description = description;
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const productIndex = products.findIndex(product => product.id === this.id);
        const updateProducts = [...products];
        updateProducts[productIndex] = this;
        fs.writeFile(savePath, JSON.stringify(updateProducts), (err) => {
          console.log('err', err);
        });
      } else {
        this.id = uuid();
        products.push(this);
        fs.writeFile(savePath, JSON.stringify(products), (err) => {
          console.log('err', err);
        });
      }
    });
  }

  static delete(id) {
    getProductsFromFile(products => {
      const product = products.find(prod => prod.id === id);
      const updatedProduct = products.filter(prod => prod.id !== id);
      fs.writeFile(savePath, JSON.stringify(updatedProduct), err => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

  static findById(id, callback) {
    getProductsFromFile(products => {
      const product = products.find(prod => prod.id === id);
      callback(product);
    })
  }
}

module.exports = Product;