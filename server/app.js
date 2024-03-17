const express = require("express");
var app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const userRoute = require("./routes/user.route");
const accountRoute = require("./routes/account.route");
const categoryRoute = require("./routes/category.route");
const productRoute = require("./routes/product.route");
const cartRoute = require("./routes/cart.route");
const connectDB = require("./services/db.connection");
const { authenticateToken } = require("./services/helper");

dotenv.config();
//Connecting the Database
connectDB();

let allowCrossDomain = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With, auth"
  );

  if ("OPTIONS" === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

// parse application/json
app.use(bodyParser.json());

app.use(allowCrossDomain);
app.use("/api/", accountRoute);
app.use("/api/user/", authenticateToken, userRoute);
app.use("/api/category/", categoryRoute);
app.use("/api/product/", productRoute);
app.use("/api/cart/", cartRoute);

app.listen(process.env.APP_PORT, () => {
  console.log("Started application on port %d", process.env.APP_PORT);
});
