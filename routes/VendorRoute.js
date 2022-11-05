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
} = require("../controllers/VendorController");

const { upload } = require("../utility/AWS");

router.post("/login", VendorLogin);

router.use(verifyToken);

router.get("/profile", GetVendorProfile);
router.patch("/profile", UpdateVendorProfile);

// router.post("/food", upload.single("image"), AddFood);
// router.get("/foods", GetFoods);

router.patch("/coverimage", upload.single('file'),UpdateVendorCoverImage);
// router.patch("/service", UpdateVendorService);

module.exports = router;
