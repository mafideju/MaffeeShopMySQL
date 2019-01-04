const fs = require('fs');
const path = require('path');

const savePath = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(savePath, (err, data) => {
      let cart = {
        products: [],
        totalPrice: 0
      }
      if (!err) {
        cart = JSON.parse(data);
      }

      const productIndex = cart.products.findIndex(prod => prod.id === id);
      const existingProduct = cart.products[productIndex]
      let updatedProduct;

      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[productIndex] = updatedProduct;
      } else {
        updatedProduct = { id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(savePath, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(savePath, (err, data) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(data) };
      const product = updatedCart.products.find(prod => prod.id === id);

      if (!product) {
        return;
      }

      updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice * product.qty;

      fs.writeFile(savePath, JSON.stringify(updatedCart), err => {
        console.log(err);
      });
    })
  }

  static getCart(callback) {
    fs.readFile(savePath, (err, data) => {
      const cart = JSON.parse(data);
      console.log(cart)
      if (!err) {
        callback(cart)
      } else {
        callback(null);
      }
    });
  }
}

module.exports = Cart;