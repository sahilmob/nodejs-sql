const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const User = require("./models/user");
const Order = require("./models/order");
const OrderIrem = require("./models/order-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
	User.findByPk(1)
		.then(user => {
			req.user = user;
			next();
		})
		.catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderIrem });

sequelize
	// .sync({ force: true })
	.sync()
	.then(result => {
		return User.findByPk(1);
		// console.log(result);
	})
	//We can chain then because we returned User.findByID which returns a promise
	.then(user => {
		if (!user) {
			return User.create({ name: "Sahil", email: "text@test.com" });
		}
		//We returned a promise to by consistent with the if block in order to chain then
		// return Promise.resolve(user);
		//This statment is equivalent to the above one because returning inside a then block will always return a promise
		return user;
	})
	//We can chain then because we returned User.findByID which returns a promise
	.then(user => {
		return user.createCart();
	})
	.then(cart => {
		app.listen(3000);
	})
	.catch(err => {
		console.log(err);
	});
