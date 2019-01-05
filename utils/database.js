// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'nodemax',
//   password: '@Brigo83'
// });

// module.exports = pool.promise();

const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodemax', 'root', '@Brigo83', {
  dialect: 'mysql',
  host: 'localhost',
  operatorsAliases: false
});

module.exports = sequelize;