const express = require("express");
const router = express.Router();
const {
   GetFoodAvailability,
   GetTopRestaurants,
   GetFoodsIn30Min,
   SearchFoods,
   RestaurantById,
   GetAvailableOffers
} = require("../controllers/ShoppingController");

/* ------------------- Food Availability --------------------- */
router.get("/:pincode", GetFoodAvailability);

// /* ------------------- Top Restaurant --------------------- */
router.get("/top-restaurant/:pincode", GetTopRestaurants);

// /* ------------------- Food Available in 30 Minutes --------------------- */
router.get("/foods-in-30-min/:pincode", GetFoodsIn30Min);

// /* ------------------- Search Foods --------------------- */
router.get("/search/:pincode", SearchFoods);

// /* ------------------- Find Restaurant by ID --------------------- */
router.get("/restaurant/:id", RestaurantById);

/* ------------------- Search Offers --------------------- */
router.get("/offers/:pincode", GetAvailableOffers);

module.exports = router;
