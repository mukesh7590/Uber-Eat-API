const express = require("express");
const router = express.Router();
const {
   CreateVendor,
   GetVendors,
   GetVendorByID,
   GetTransactions,
   GetTransactionById,
   GetDeliveryUsers,
} = require("../controllers/AdminController");

// vendor create, gets all vendors, get vendor by ID
router.post("/vendor", CreateVendor);
router.get("/vendors", GetVendors);
router.get("/vendor/:id", GetVendorByID);

// transactions routing here
router.get("/transactions", GetTransactions);
router.get("/transaction/:id", GetTransactionById);

// router.put('/delivery/verify', VerifyDeliveryUser)
router.get("/delivery/users", GetDeliveryUsers);
module.exports = router;
