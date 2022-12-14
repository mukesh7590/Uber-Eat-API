const Vendor = require("../models/VendorModel");
const Transaction = require("../models/TransactionModel");
const DeliveryUser = require("../models/DeliveryUserModel");
const asyncHandler = require("express-async-handler");
const {
   GeneratePassword,
   GenerateSalt,
   GenerateSignature,
   ValidatePassword,
} = require("../utility/PasswordUtility");

const FindVendor = async (id, email) => {
   if (email) {
      return await Vendor.findOne({ email: email });
   } else {
      return await Vendor.findById(id);
   }
};

const CreateVendor = asyncHandler(async (req, res) => {
   const {
      name,
      address,
      pincode,
      foodType,
      email,
      password,
      ownerName,
      phone,
   } = req.body;

   const existingVandor = await FindVendor("", email);

   if (existingVandor !== null) {
      return res.json({
         message: "A vendor is already exists with this email",
      });
   }

   //generate a salt
   const salt = await GenerateSalt();
   const userPassword = await GeneratePassword(password, salt);

   const createdVendor = await Vendor.create({
      name: name,
      address: address,
      pincode: pincode,
      foodType: foodType,
      email: email,
      password: userPassword,
      salt: salt,
      ownerName: ownerName,
      phone: phone,
      rating: 0,
      serviceAvailable: false,
      coverImages: [],
      lat: 0,
      lng: 0,
   });
   return res.json(createdVendor);
});

const GetVendors = asyncHandler(async (req, res) => {
   const vendors = await Vendor.find();

   if (vendors !== null) {
      return res.json(vendors);
   }

   return res.json({ message: "Vendors data is not available" });
});

const GetVendorByID = asyncHandler(async (req, res) => {
   const vendorId = req.params.id;

   const vendor = await FindVendor(vendorId);

   if (vendor !== null) {
      return res.json(vendor);
   }

   return res.json({ message: "Vendors data is not available" });
});

const GetTransactions = async (req, res) => {
   const transactions = await Transaction.find();

   if (transactions) {
      return res.status(200).json(transactions);
   }

   return res.json({ message: "Transactions data not available" });
};

const GetTransactionById = async (req, res) => {
   const id = req.params.id;

   const transaction = await Transaction.findById(id);

   if (transaction) {
      return res.status(200).json(transaction);
   }

   return res.json({ message: "Transaction data not available" });
};

const GetDeliveryUsers = async (req, res) => {
   const deliveryUsers = await DeliveryUser.find();
   if (deliveryUsers) {
      return res.status(200).json(deliveryUsers);
   }
   return res.json({ message: "Unable to get Delivery Users" });
};

module.exports = {
   FindVendor,
   CreateVendor,
   GetVendors,
   GetVendorByID,
   GetTransactions,
   GetTransactionById,
   GetDeliveryUsers,
};
