const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      products,
      docTitle: "Lista de Produtos!",
      path: "/products",
    });
  });
}

exports.getProduct = (req, res) => {
  const productID = req.params.id;
  console.log('Params =>', req.params);
  Product.findById(productID, product => {
    res.render('shop/product-detail', {
      product,
      docTitle: product.title,
      path: '/products'
    });
  });
}

exports.getIndex = (req, res) => {
  Product.fetchAll((products) => {
    res.render('shop/index', {
      products,
      docTitle: "Maffee Shop It!",
      path: "/",
    });
  });
}

exports.getCart = (req, res) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (let product of products) {
        const cartProductData = cart.products.find(p => p.id === product.id);
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        docTitle: 'Carrinho de Compras',
        path: '/cart',
        products: cartProducts
      });
    });
  });
}

exports.postCart = (req, res) => {
  const productID = req.body.id;
  Product.findById(productID, product => {
    Cart.addProduct(productID, product.price);
  });
  res.redirect('/cart')
}

exports.postCartDelete = (req, res) => {
  const productID = req.body.id;
  console.log('productID', productID)
  Product.findById(productID, product => {
    Cart.deleteProduct(productID, product.price);
    res.redirect('/cart');
  });
}

exports.getOrders = (req, res) => {
  res.render('shop/orders', {
    docTitle: 'Seus Pedidos na Maffee',
    path: '/orders'
  })
}


exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    docTitle: 'Pegou tudo que precisa?',
    path: '/checkout'
  })
}