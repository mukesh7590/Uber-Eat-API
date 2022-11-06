// import { GetVendorByID } from "./AdminController";

const Customer = require("../models/CustomerModel");
const Food =require("../models/FoodModel")
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

/* ------------------- Cart Section --------------------- */
const AddToCart = async (req, res) => {
   // get the customer from request middleware funtion
   const customer = req.user;
   // check if customer is there
   if (customer) {
      // fetch the profile from Customer DB by customerID
      const profile = await Customer.findById(customer._id);
      // initialize the array for CartItems
      let cartItems = Array();
      // fetch the itemID and unit from req-Body
      const { _id, unit } = req.body;

      // FETCHING THE FOOD FROM DB BY ID
      const food = await Food.findById(_id);

      // CHECK FOR IF WE GET THE FOOD
      if (food) {
         // CHECK IF PROFILE EXSIST OR NOT
         if (profile != null) {
            // PUT THE PROFILE CART BUCKET INTO THE CARTITEMS
            cartItems = profile.cart;
            // CARTITEMS BUCKET IS EMPTY OF NOT
            if (cartItems.length > 0) {
               // CHECK THE CART
               let existFoodItems = cartItems.filter(
                  (item) => item.food._id.toString() === _id
               );
               if (existFoodItems.length > 0) {
                  // fetch the index from cartItems
                  const index = cartItems.indexOf(existFoodItems[0]);

                  if (unit > 0) {
                     // updating the cartIndex with new Unit
                     cartItems[index] = { food, unit };
                  } else {
                     // removing the index from cartItems
                     cartItems.splice(index, 1);
                  }
               } else {
                  // item not in the cartItems bucket so push on it into the bucket
                  cartItems.push({ food, unit });
               }
            } else {
               // pushing the first item into the cart
               cartItems.push({ food, unit });
            }

            if (cartItems) {
               // updating the cart
               profile.cart = cartItems;
               // save the profile
               const cartResult = await profile.save();
               return res.status(200).json(cartResult.cart);
            }
         }
      }
   }

   return res.status(404).json({ msg: "Unable to add to cart!" });
};

const GetCart = async (req, res) => {
   const customer = req.user;

   if (customer) {
      const profile = await Customer.findById(customer._id);
      if (profile) {
         return res.status(200).json(profile.cart);
      }
   }
   return res.status(400).json({ message: "Cart is Empty!" });
};

const DeleteCart = async (req, res) => {
   const customer = req.user;

   if (customer) {
      const profile = await Customer.findById(customer._id)
         .populate("cart.food")
         .exec();

      if (profile != null) {
         profile.cart = [];
         const cartResult = await profile.save();
         return res.status(200).json(cartResult);
      }
   }

   return res.status(400).json({ message: "cart is Already Empty!" });
};

module.exports = {
   CustomerSignUp,
   CustomerVerify,
   CustomerLogin,
   RequestOtp,
   GetCustomerProfile,
   EditCustomerProfile,
   AddToCart,
   DeleteCart,
   GetCart,
};
