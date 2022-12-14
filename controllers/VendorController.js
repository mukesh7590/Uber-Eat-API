const asyncHandler = require("express-async-handler");
const { FindVendor } = require("./AdminController");
const Food = require("../models/FoodModel");
const Order = require("../models/OrderModel");
const Offer = require("../models/OfferModel");
const {
   GenerateSignature,
   ValidatePassword,
} = require("../utility/PasswordUtility");

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

// ================================== ORDER SECTION IS HERE ==================================
const GetOrders = async (req, res) => {
   const user = req.user;
   if (user) {
      const orders = await Order.find({ vendorId: user._id }).populate(
         "items.food"
      );
      if (orders != null) {
         return res.status(200).json(orders);
      }
   }
   return res.json({ message: "Orders Not found" });
};

const GetOrderDetails = async (req, res) => {
   const orderId = req.params.id;
   if (orderId) {
      const order = await Order.findById(orderId).populate("items.food");
      if (order != null) {
         return res.status(200).json(order);
      }
   }
   return res.json({ message: "Order Not found" });
};

const ProcessOrder = async (req, res) => {
   const orderId = req.params.id;
   // orderStatus : Accepted, Waiting, Prepared, Completed
   // deliverySatus :Not Ready, Ready, Dipatched, On the Way, delivered

   const { orderStatus, deliveryStatus, time } = req.body;
   if (orderId) {
      const order = await Order.findById(orderId).populate("items.food");
      order.orderStatus = orderStatus;
      order.deliverySatus = deliveryStatus;
      if (time) {
         order.readyTime = time;
      }
      const orderResult = await order.save();
      if (orderResult != null) {
         return res.status(200).json(orderResult);
      }
   }
   return res.json({ message: "Unable to process order" });
};

// ================================== OFFER SECTION IS HERE ==================================
const AddOffer = async (req, res) => {
   const user = req.user;
   if (user) {
      const {
         title,
         description,
         offerType,
         offerAmount,
         pincode,
         promocode,
         promoType,
         startValidity,
         endValidity,
         bank,
         bins,
         minValue,
         isActive,
      } = req.body;

      const vendor = await FindVendor(user._id);
      if (vendor) {
         const offer = await Offer.create({
            title,
            description,
            offerType,
            offerAmount,
            pincode,
            promoType,
            startValidity,
            endValidity,
            bank,
            isActive,
            minValue,
            vendor: [vendor],
         });
         console.log(offer);
         return res.status(200).json(offer);
      }
   }
   return res.json({ message: "Unable to add Offer!" });
};

const GetOffers = async (req, res) => {
   const user = req.user;
   if (user) {
      let currentOffer = Array();
      const offers = await Offer.find().populate("vendor");
      if (offers) {
         offers.map((item) => {
            if (item.vendor) {
               item.vendor.map((vendor) => {
                  if (vendor._id.toString() === user._id) {
                     currentOffer.push(item);
                  }
               });
            }
            if (item.offerType === "ALL") {
               currentOffer.push(item);
            }
         });
      }
      return res.status(200).json(currentOffer);
   }
   return res.json({ message: "Offers Not available" });
};

const EditOffer = async (req, res) => {
   const user = req.user;
   const offerId = req.params.id;

   if (user) {
      const {
         title,
         description,
         offerType,
         offerAmount,
         pincode,
         promocode,
         promoType,
         startValidity,
         endValidity,
         bank,
         bins,
         minValue,
         isActive,
      } = req.body;

      const currentOffer = await Offer.findById(offerId);

      if (currentOffer) {
         const vendor = await FindVendor(user._id);

         if (vendor) {
            (currentOffer.title = title),
               (currentOffer.description = description),
               (currentOffer.offerType = offerType),
               (currentOffer.offerAmount = offerAmount),
               (currentOffer.pincode = pincode),
               (currentOffer.promoType = promoType),
               (currentOffer.startValidity = startValidity),
               (currentOffer.endValidity = endValidity),
               (currentOffer.bank = bank),
               (currentOffer.isActive = isActive),
               (currentOffer.minValue = minValue);

            const result = await currentOffer.save();

            return res.status(200).json(result);
         }
      }
   }

   return res.json({ message: "Unable to add Offer!" });
};

module.exports = {
   VendorLogin,
   GetVendorProfile,
   UpdateVendorProfile,
   AddFood,
   GetFoods,

   UpdateVendorCoverImage,
   UpdateVendorService,

   GetOrders,
   GetOrderDetails,
   ProcessOrder,

   GetOffers,
   AddOffer,
   EditOffer,
};
