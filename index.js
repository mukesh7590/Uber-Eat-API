const express = require("express");
const app = express();
const dotenv = require("dotenv");

const AdminRoute = require("./routes/AdminRoute");
const VendorRoute = require("./routes/VendorRoute");
const CustomerRoute = require("./routes/CustomerRoute");
const ShoppingRoute = require("./routes/ShoppingRoute");

const cors = require("cors");
const connectDB = require("./config/mongoose");
dotenv.config();

connectDB();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/admin", AdminRoute);
app.use("/vendor", VendorRoute);
app.use("/customer", CustomerRoute);
// app.use("/delivery", DeliveryRoute);

app.use(ShoppingRoute);

app.listen(8000, () => {
   console.log("\n\n\t\t\t\tSERVER IS RUNNING!");
});
