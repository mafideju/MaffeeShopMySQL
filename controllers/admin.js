const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    docTitle: "Adicionar Novo Produto",
    path: "/admin/add-product",
    editing: false
  });
}

exports.postAddProduct = (req, res) => {
  req.user
    .createProduct({
      title: req.body.title,
      image: req.body.image,
      price: req.body.price,
      description: req.body.description
    }).then(() => {
      return res.redirect('/admin/products');
    }).catch(err => console.log('postAddProduct =>', err));
}

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  // console.log("Edit Mode", editMode);
  if (!editMode) {
    return res.redirect('/');
  }
  const productID = req.params.editID;
  Product.findByPk(productID)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        docTitle: "Editar Produto",
        path: "/admin/edit-product",
        editing: editMode,
        product
      });
    })
    .catch(err => console.log(err));
}

exports.postEditProduct = (req, res) => {
  Product.findByPk(req.body.id)
    .then(product => {
      product.title = req.body.title;
      product.image = req.body.image;
      product.price = req.body.price;
      product.description = req.body.description;
      return product.save();
    })
    .then(data => {
      // console.log('updated data', data);
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}

exports.getProducts = (req, res) => {
  Product.findAll()
    .then(products => {
      res.render('admin/products', {
        products,
        docTitle: "Maffee Control!",
        path: "/admin/products",
      });
    })
    .catch(err => console.log('admin/products', err));
}

exports.postDeleteProduct = (req, res) => {
  const productID = req.body.id;
  Product.findByPk(productID)
    .then(product => {
      return product.destroy();
    })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}