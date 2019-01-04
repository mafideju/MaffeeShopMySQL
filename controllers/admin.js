const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    docTitle: "Adicionar Novo Produto",
    path: "/admin/add-product",
    editing: false
  });
}

exports.postAddProduct = (req, res) => {
  const product = new Product(
    null,
    req.body.title,
    req.body.image,
    req.body.price,
    req.body.description
  );
  product.save()
    .then(() => {
      res.redirect('/');
    })
    .catch(err => console.log(err));
}

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  console.log("Edit Mode", editMode);
  if (!editMode) {
    return res.redirect('/');
  }
  const productID = req.params.editID;
  Product.findById(productID, product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      docTitle: "Editar Produto",
      path: "/admin/edit-product",
      editing: editMode,
      product
    });
  });
}

exports.postEditProduct = (req, res) => {
  const updatedProduct = new Product(
    req.body.id,
    req.body.title,
    req.body.image,
    req.body.price,
    req.body.description
  );
  updatedProduct.save();
  res.redirect('/admin/products');
}

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      products,
      docTitle: "Maffee Control!",
      path: "/admin/products",
    });
  });
}

exports.postDeleteProduct = (req, res) => {
  const productID = req.body.id;
  Product.delete(productID);
  res.redirect('/admin/products');
}