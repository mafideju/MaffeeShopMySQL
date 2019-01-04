const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'nodemax',
  password: '@Brigo83'
});

module.exports = pool.promise();