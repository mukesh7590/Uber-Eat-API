// mport { Food, Order, Offer } from "../models";
const {
   GenerateSignature,
   ValidatePassword,
} = require("../utility/PasswordUtility");
const asyncHandler = require("express-async-handler");

const { FindVendor } = require("./AdminController");
const Food = require("../models/FoodModel");

// ================================== Vendor Profile Operations ==================================

const VendorLogin = asyncHandler(async (req, res) => {
   const { email, password } = req.body;
   const existingVendor = await FindVendor("", email);
   if (existingVendor !== null) {
      const validation = await ValidatePassword(
         password,
         existingVendor.password,
         existingVendor.salt
      );

      if (validation) {
         const signature = GenerateSignature({
            _id: existingVendor.id,
            email: existingVendor.email,
            foodTypes: existingVendor.foodType,
            name: existingVendor.name,
         });
         return res.json(signature);
      } else {
         return res.json({ message: "Password is not valid" });
      }
   }

   return res.json({ message: "Login credentials is not valid" });
});

const GetVendorProfile = asyncHandler(async (req, res) => {
   const user = req.user;
   if (user) {
      const existingVendor = await FindVendor(user._id);
      return res.json(existingVendor);
   }
   return res.json({ message: "Vendor information is not found" });
});

const UpdateVendorProfile = asyncHandler(async (req, res) => {
   const { foodTypes, name, address, phone } = req.body;
   const user = req.user;
   if (user) {
      const existingVendor = await FindVendor(user._id);
      if (existingVendor !== null) {
         existingVendor.name = name;
         existingVendor.address = address;
         existingVendor.phone = phone;
         existingVendor.foodType = foodTypes;
         const saveResult = await existingVendor.save();
         return res.json(saveResult);
      }

      return res.json(existingVendor);
   }
   return res.json({ message: "Vendor information is not found" });
});

// ================================== Food Operations By Vendor ==================================

const AddFood = async (req, res) => {
   const user = req.user;
   if (user) {
      const { name, description, category, foodType, readyTime, price } =
         req.body;
      const vendor = await FindVendor(user._id);
      if (vendor !== null) {
         const createdFood = await Food.create({
            vendorId: vendor._id,
            name: name,
            description: description,
            category: category,
            foodType: foodType,
            images: [req.file.location],
            readyTime: readyTime,
            price: price,
            rating: 0,
         });
         vendor.foods.push(createdFood);
         const result = await vendor.save();
         return res.json(result);
      }
   }
   return res.json({ message: "Something went wrong with add food" });
};

const GetFoods = async (req, res) => {
   const user = req.user;
   if (user) {
      const foods = await Food.find({ vendorId: user._id });

      if (foods !== null) {
         return res.json(foods);
      }
   }
   return res.json({ message: "Food information not found" });
};

const UpdateVendorCoverImage = async (req, res) => {
   const user = req.user;

   console.log("image address => ", req.file.location);

   if (user) {
      const vendor = await FindVendor(user._id);

      if (vendor !== null) {
         vendor.coverImages.push(req.file.location);

         const saveResult = await vendor.save();

         return res.json(saveResult);
      }
   }
   return res.json({ message: "Unable to Update vendor profile " });
};

const UpdateVendorService = async (req, res) => {
   const user = req.user;
   const { lat, lng } = req.body;
   if (user) {
      const existingVendor = await FindVendor(user._id);
      if (existingVendor !== null) {
         existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
         if (lat && lng) {
            existingVendor.lat = lat;
            existingVendor.lng = lng;
         }
         const saveResult = await existingVendor.save();
         return res.json(saveResult);
      }
      return res.json(existingVendor);
   }
   return res.json({ message: "Vendor information is not found" });
};

module.exports = {
   VendorLogin,
   GetVendorProfile,
   UpdateVendorProfile,
   AddFood,
   GetFoods,
   UpdateVendorCoverImage,
   UpdateVendorService,
};
