// import { GetVendorByID } from "./AdminController";

const Customer = require("../models/CustomerModel");
const { check, validationResult } = require("express-validator");
const {
   GeneratePassword,
   GenerateSalt,
   GenerateSignature,
   ValidatePassword,
} = require("../utility/PasswordUtility");
const { GenerateOtp, onRequestOTP } = require("../utility/NotificationUtility");

const CustomerSignUp = async (req, res) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      console.log("error aayi hai => ", errors);
      return res.status(400).json(errors);
   }

   const { email, phone, password } = req.body;

   const salt = await GenerateSalt();
   const userPassword = await GeneratePassword(password, salt);

   const { otp, expiry } = GenerateOtp();

   const existingCustomer = await Customer.find({ email: email });

   // console.log("length -> ",Object.keys(existingCustomer).length !== 0);

   if (Object.keys(existingCustomer).length !== 0) {
      return res.status(400).json({ message: "Email already exist!" });
   }

   const result = await Customer.create({
      email: email,
      password: userPassword,
      salt: salt,
      firstName: "",
      lastName: "",
      address: "",
      phone: phone,
      verified: false,
      otp: otp,
      otp_expiry: expiry,
      lat: 0,
      lng: 0,
   });

   if (result) {
      // return res.status(201).json(result);
      // send OTP to customer
      await onRequestOTP(otp, phone);

      //Generate the Signature
      const signature = await GenerateSignature({
         _id: result._id,
         email: result.email,
         verified: result.verified,
      });
      //   Send the result
      return res
         .status(201)
         .json({ signature, verified: result.verified, email: result.email });
   }

   return res.status(400).json({ msg: "Error while creating user" });
};

const CustomerVerify = async (req, res) => {
   const { otp } = req.body;
   const customer = req.user;

   if (customer) {
      const profile = await Customer.findById(customer._id);
      if (profile) {
         if (
            profile.otp === parseInt(otp) &&
            profile.otp_expiry >= new Date()
         ) {
            profile.verified = true;

            const updatedCustomerResponse = await profile.save();

            const signature = GenerateSignature({
               _id: updatedCustomerResponse._id,
               email: updatedCustomerResponse.email,
               verified: updatedCustomerResponse.verified,
            });

            return res.status(200).json({
               signature,
               email: updatedCustomerResponse.email,
               verified: updatedCustomerResponse.verified,
            });
         }
      }
   }

   return res.status(400).json({ msg: "Unable to verify Customer" });
};

const CustomerLogin = async (req, res) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      console.log("error aayi hai => ", errors);
      return res.status(400).json(errors);
   }

   const { email, password } = req.body;

   const customer = await Customer.findOne({ email: email });

   if (customer) {
      const validation = await ValidatePassword(
         password,
         customer.password,
         customer.salt
      );

      if (validation) {
         const signature = GenerateSignature({
            _id: customer._id,
            email: customer.email,
            verified: customer.verified,
         });

         return res.status(200).json({
            signature,
            email: customer.email,
            verified: customer.verified,
         });
      }
   }

   return res.json({ msg: "Error With Signup" });
};

// correct
const RequestOtp = async (req, res) => {
   const customer = req.user;

   if (customer) {
      const profile = await Customer.findById(customer._id);

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

const GetCustomerProfile = async (req, res) => {
   const customer = req.user;

   if (customer) {
      const profile = await Customer.findById(customer._id);

      if (profile) {
         return res.status(201).json(profile);
      }
   }
   return res.status(400).json({ msg: "Error while Fetching Profile" });
};

const EditCustomerProfile = async (req, res) => {
   const customer = req.user;

   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      console.log("error aayi hai => ", errors);
      return res.status(400).json(errors);
   }
   const { firstName, lastName, address } = req.body;

   if (customer) {
      const profile = await Customer.findById(customer._id);

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

module.exports = {
   CustomerSignUp,
   CustomerVerify,
   CustomerLogin,
   RequestOtp,
   GetCustomerProfile,
   EditCustomerProfile,
};
