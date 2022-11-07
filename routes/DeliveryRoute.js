const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleWares/CommonAuth");
const { check } = require("express-validator");
const {
   DeliverySignUp,
   DeliveryLogin,
   DriverVerify,
   RequestOtp,
   GetDeliveryProfile,
   EditDeliveryProfile,
   UpdateDeliveryUserStatus,
} = require("../controllers/DeliveryController");

// vendor create, gets all vendors, get vendor by ID

/* ------------------- Signup / Create Customer --------------------- */
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
      check("pincode", "Please valid Pin-Code").isLength({
         min: 6,
         max: 6,
      }),
   ],
   DeliverySignUp
);

/* ------------------- Login --------------------- */
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
   DeliveryLogin
);

/* ------------------- Authentication --------------------- */
router.use(verifyToken);
router.patch("/verify", DriverVerify);
router.get("/otp", RequestOtp);

/* ------------------- Profile --------------------- */
router.get("/profile", GetDeliveryProfile);
router.patch("/profile", EditDeliveryProfile);

/* ------------------- Change Service Status --------------------- */
router.put("/change-status", UpdateDeliveryUserStatus);
module.exports = router;
