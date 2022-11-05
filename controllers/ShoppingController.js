const Customer = require("../models/CustomerModel");
const Vendor = require("../models/VendorModel");

// available resturants list who can deliverd the food
const GetFoodAvailability = async (req, res) => {
   const pincode = req.params.pincode;
   const result = await Vendor.find({
      pincode: pincode,
      serviceAvailable: true,
   })
      .sort({ rating: -1 })
      .populate("foods");
   if (result.length > 0) {
      return res.status(200).json(result);
   }

   return res.status(404).json({ msg: "data Not found!" });
};

// top restaurants list
const GetTopRestaurants = async (req, res) => {
   const pincode = req.params.pincode;
   const result = await Vendor.find({
      pincode: pincode,
      serviceAvailable: true,
   })
      .sort({ rating: -1 })
      .limit(10);

   if (result.length > 0) {
      return res.status(200).json(result);
   }

   return res.status(404).json({ msg: "data Not found!" });
};

// foods list which will be available in 30 minutes
const GetFoodsIn30Min = async (req, res) => {
   const pincode = req.params.pincode;
   const result = await Vendor.find({
      pincode: pincode,
      serviceAvailable: true,
   }).populate("foods");

   if (result.length > 0) {
      let foodResult = [];

      result.map((vendor) => {
         const foods = vendor.foods;
         foodResult.push(...foods.filter((food) => food.readyTime < 30));
      });

      return res.status(200).json(foodResult);
   }

   return res.status(404).json({ msg: "data Not found!" });
};

// gives the all foods list which is available now
const SearchFoods = async (req, res) => {
   const pincode = req.params.pincode;
   const result = await Vendor.find({
      pincode: pincode,
      serviceAvailable: true,
   }).populate("foods");

   if (result.length > 0) {
      let foodResult = [];
      result.map((item) => foodResult.push(...item.foods));
      return res.status(200).json(foodResult);
   }

   return res.status(404).json({ msg: "data Not found!" });
};

// get a single restaurant by ID
const RestaurantById = async (req, res) => {
   const id = req.params.id;
   const result = await Vendor.findById(id).populate("foods");

   if (result) {
      return res.status(200).json(result);
   }

   return res.status(404).json({ msg: "data Not found!" });
};

module.exports = {
   GetFoodAvailability,
   GetTopRestaurants,
   GetFoodsIn30Min,
   SearchFoods,
   RestaurantById,
};

// export const GetAvailableOffers = async (
//    req: Request,
//    res: Response,
//    next: NextFunction
// ) => {
//    const pincode = req.params.pincode;

//    const offers = await Offer.find({ pincode: pincode, isActive: true });

//    if (offers) {
//       return res.status(200).json(offers);
//    }

//    return res.json({ message: "Offers not Found!" });
// };
