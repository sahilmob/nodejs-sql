const mysql = require("mysql2");

const pool = mysql.createPool({
	host: "localhost",
	user: "root",
	database: "node_course",
	password: "sahil123"
});

module.exports = pool.promise();
