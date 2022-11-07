const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleWares/CommonAuth");
const { check } = require("express-validator");
const {
   CustomerSignUp,
   CustomerVerify,
   CustomerLogin,
   RequestOtp,
   GetCustomerProfile,
   EditCustomerProfile,
   AddToCart,
   DeleteCart,
   GetCart,
   CreateOrder,
   GetOrderById,
   GetOrders,
   CreatePayment,
} = require("../controllers/CustomerController");

/* ------------------- Signup / Login Customer --------------------- */
router.post(
   "/signup",
   [
      check("email", "Email is not valid").isEmail(),

      check("phone", "Mobile number should contains 10 digits").isLength({
         min: 10,
         max: 10,
      }),
      check(
         "password",
         "Password length should be 8 to 10 characters"
      ).isLength({
         min: 6,
         max: 10,
      }),
   ],
   CustomerSignUp
);
router.post(
   "/login",
   [
      check("email", "Email is not valid").isEmail(),

      check(
         "password",
         "Password length should be 8 to 10 characters"
      ).isLength({
         min: 6,
         max: 10,
      }),
   ],
   CustomerLogin
);

/* ------------------- Authentication Need here below--------------------- */
router.use(verifyToken);
router.patch("/verify", CustomerVerify);
router.get("/otp", RequestOtp);
router.get("/profile", GetCustomerProfile);
router.patch(
   "/profile",
   [
      check("firstName", "Please enter your good Name").isLength({
         min: 1,
         max: 10,
      }),
      check("lastName", "Please enter your last Name").isLength({
         min: 1,
         max: 10,
      }),
      check("address", "Please enter your Address").isLength({
         min: 1,
         max: 10,
      }),
   ],
   EditCustomerProfile
);

//Cart Section
router.post("/cart", AddToCart);
router.get("/cart", GetCart);
router.delete("/cart", DeleteCart);

//Order Section
router.post("/create-order", CreateOrder);
router.get("/orders", GetOrders);
router.get("/order/:id", GetOrderById);

// //Apply Offers
// router.get("/offer/verify/:id", VerifyOffer);

// //Payment
router.post("/create-payment", CreatePayment);

module.exports = router;
