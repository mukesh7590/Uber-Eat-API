const express = require("express");
const router = express.Router();

const {
   CreateVendor,
   GetVendors,
   GetVendorByID,
} = require("../controllers/AdminController");

// vendor create, gets all vendors, get vendor by ID
router.post("/vendor", CreateVendor);
router.get("/vendors", GetVendors);
router.get("/vendor/:id", GetVendorByID);

module.exports = router;
