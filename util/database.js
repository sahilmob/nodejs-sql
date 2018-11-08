const Sequelize = require("sequelize");

const sequelize = new Sequelize("node_course", "root", "sahil123", {
	dialect: "mysql",
	host: "localhost"
});

module.exports = sequelize;
