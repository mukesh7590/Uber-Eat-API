const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleWares/CommonAuth");
const {
   VendorLogin,
   GetVendorProfile,
   UpdateVendorProfile,
   UpdateVendorService,
   AddFood,
   GetFoods,
   UpdateVendorCoverImage,
   GetOrders,
   GetOrderDetails,
   ProcessOrder,
} = require("../controllers/VendorController");

const { upload } = require("../AWS");

router.post("/login", VendorLogin);

router.use(verifyToken);

router.get("/profile", GetVendorProfile);
router.patch("/profile", UpdateVendorProfile);
router.post("/food", upload.single("image"), AddFood);
router.get("/foods", GetFoods);

router.patch("/coverimage", upload.single("image"), UpdateVendorCoverImage);
router.patch("/service", UpdateVendorService);

// orders
router.get("/orders", GetOrders);
router.put("/order/:id/process", ProcessOrder);
router.get("/order/:id", GetOrderDetails);

module.exports = router;
