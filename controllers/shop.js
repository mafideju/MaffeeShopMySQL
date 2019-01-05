const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');

// ORM: Object Relational Mapping

exports.getProducts = (req, res) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        products,
        docTitle: "Lista de Produtos!",
        path: "/products",
      });
    })
    .catch(err => console.log("getProducts =>", err));
}

exports.getProduct = (req, res) => {
  const productID = req.params.id;
  // console.log('Params =>', req.params);
  Product.findByPk(productID)
    .then(product => {
      // console.log(product[0].title)
      res.render('shop/product-detail', {
        product: product,
        docTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log("getProduct", getProduct));
}

exports.getIndex = (req, res) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        products,
        docTitle: "Maffee Shop It!",
        path: "/",
      });
    })
    .catch(err => console.log(err));
}

exports.getCart = (req, res) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          res.render('shop/cart', {
            path: '/cart',
            docTitle: 'Seu Carrinho de Compras',
            products
          })
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err));
}

exports.postCart = (req, res) => {
  const productID = req.body.id;
  let fetchedCart;
  let newQty = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productID } })
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQty = product.cartItem.qty;
        newQty = oldQty + 1;
      }
      return Product.findByPk(productID)
        .then(product => {
          return fetchedCart.addProduct(product, {
            through: { qty: newQty }
          })
        })
    })
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.postCartDelete = (req, res) => {
  const productID = req.body.id;
  // console.log('productID', productID)
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: productID } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
  Product.findById(productID, product => {
    Cart.deleteProduct(productID, product.price);
  });
}

exports.postOrder = (req, res) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { qty: product.cartItem.qty };
              // console.log('QUANTIDADE DE PRODUCT =>', product.orderItem.qty)
              return product;
            })
          );
        })
        .catch(err => console.log(err));
    })
    .then(data => {
      return fetchedCart.setProducts(null);
    })
    .then(data => res.redirect('/orders'))
    .catch(err => console.log(err));
}

exports.getOrders = (req, res) => {
  req.user
    .getOrders({ include: ['products'] })
    .then(orders => {
      res.render('shop/orders', {
        docTitle: 'Seus Pedidos na Maffee',
        path: '/orders',
        orders
      })
    })
    .catch(err => console.log(err));
}


exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    docTitle: 'Pegou tudo que precisa?',
    path: '/checkout'
  })
}