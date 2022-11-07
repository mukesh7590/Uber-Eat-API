const Vendor = require("../models/VendorModel");
const DeliveryUser = require("../models/DeliveryUserModel");
const { validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const {
   GeneratePassword,
   GenerateSalt,
   GenerateSignature,
   ValidatePassword,
} = require("../utility/PasswordUtility");
const { GenerateOtp, onRequestOTP } = require("../utility/NotificationUtility");

const DeliverySignUp = async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      console.log("error aayi hai => ", errors);
      return res.status(400).json(errors);
   }
   const { email, phone, password, pincode } = req.body;
   const salt = await GenerateSalt();
   const userPassword = await GeneratePassword(password, salt);
   const { otp, expiry } = GenerateOtp();
   const existingDeliveryUser = await DeliveryUser.findOne({ email: email });
   if (existingDeliveryUser !== null) {
      return res.status(400).json({
         message: "A Delivery User exist with the provided email ID!",
      });
   }
   const result = await DeliveryUser.create({
      email: email,
      password: userPassword,
      salt: salt,
      firstName: "",
      lastName: "",
      address: "",
      phone: phone,
      pincode: pincode,
      verified: false,
      otp: otp,
      otp_expiry: expiry,
      lat: 0,
      lng: 0,
   });

   if (result) {
      // send OTP to customer
      await onRequestOTP(otp, phone);

      //Generate the Signature
      const signature = await GenerateSignature({
         _id: result._id,
         email: result.email,
         verified: result.verified,
      });
      // Send the result
      return res
         .status(201)
         .json({ signature, verified: result.verified, email: result.email });
   }

   return res.status(400).json({ msg: "Error while creating Delivery user" });
};

const DeliveryLogin = async (req, res) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      console.log("error aayi hai => ", errors);
      return res.status(400).json(errors);
   }

   const { email, password } = req.body;

   const deliveryUser = await DeliveryUser.findOne({ email: email });
   if (deliveryUser) {
      const validation = await ValidatePassword(
         password,
         deliveryUser.password,
         deliveryUser.salt
      );

      if (validation) {
         const signature = GenerateSignature({
            _id: deliveryUser._id,
            email: deliveryUser.email,
            verified: deliveryUser.verified,
         });

         return res.status(200).json({
            signature,
            email: deliveryUser.email,
            verified: deliveryUser.verified,
         });
      }
   }

   return res.json({ msg: "Error Login" });
};

const DriverVerify = async (req, res) => {
   const { otp } = req.body;
   const driver = req.user;

   if (driver) {
      const profile = await DeliveryUser.findById(driver._id);
      if (profile) {
         if (
            profile.otp === parseInt(otp) &&
            profile.otp_expiry >= new Date()
         ) {
            profile.verified = true;

            const updatedDriverResponse = await profile.save();

            const signature = GenerateSignature({
               _id: updatedDriverResponse._id,
               email: updatedDriverResponse.email,
               verified: updatedDriverResponse.verified,
            });

            return res.status(200).json({
               signature,
               email: updatedDriverResponse.email,
               verified: updatedDriverResponse.verified,
            });
         }
      }
   }

   return res.status(400).json({ msg: "Unable to verify Driver" });
};

const RequestOtp = async (req, res) => {
   const driver = req.user;

   if (driver) {
      const profile = await DeliveryUser.findById(driver._id);

      if (profile) {
         const { otp, expiry } = GenerateOtp();
         profile.otp = otp;
         profile.otp_expiry = expiry;
         await profile.save();
         await onRequestOTP(otp, profile.phone);
         return res
            .status(200)
            .json({ message: "OTP sent to your registered Mobile Number!" });
      }
   }

   return res.status(400).json({ msg: "Error with Requesting OTP" });
};

const GetDeliveryProfile = async (req, res) => {
   const deliveryUser = req.user;

   if (deliveryUser) {
      const profile = await DeliveryUser.findById(deliveryUser._id);

      if (profile) {
         return res.status(201).json(profile);
      }
   }
   return res.status(400).json({ msg: "Error while Fetching Profile" });
};

const EditDeliveryProfile = async (req, res) => {
   const deliveryUser = req.user;

   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      console.log("error aayi hai => ", errors);
      return res.status(400).json(errors);
   }
   const { firstName, lastName, address } = req.body;

   if (deliveryUser) {
      const profile = await DeliveryUser.findById(deliveryUser._id);

      if (profile) {
         profile.firstName = firstName;
         profile.lastName = lastName;
         profile.address = address;
         const result = await profile.save();

         return res.status(201).json(result);
      }
   }
   return res.status(400).json({ msg: "Error while Updating Profile" });
};

/* ------------------- Delivery Notification --------------------- */

const UpdateDeliveryUserStatus = async (req, res) => {
   const deliveryUser = req.user;

   if (deliveryUser) {
      const { lat, lng } = req.body;
      const profile = await DeliveryUser.findById(deliveryUser._id);

      if (profile) {
         if (lat && lng) {
            profile.lat = lat;
            profile.lng = lng;
         }
         profile.isAvailable = !profile.isAvailable;
         const result = await profile.save();
         return res.status(201).json(result);
      }
   }
   return res.status(400).json({ msg: "Error while Updating Profile" });
};

module.exports = {
   DeliverySignUp,
   DeliveryLogin,
   DriverVerify,
   RequestOtp,
   GetDeliveryProfile,
   EditDeliveryProfile,
   UpdateDeliveryUserStatus,
};
