const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
   {
      email: { type: String, required: true },
      password: { type: String, required: true },
      salt: { type: String, required: true },
      
      firstName: { type: String },
      lastName: { type: String },
      address: { type: String },
      phone: { type: String, required: true },
      
      verified: { type: Boolean },
      otp: { type: Number },
      otp_expiry: { type: Date },
      lat: { type: Number },
      lng: { type: Number },
      
      cart: [
         {
            food: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Food",
               require: true,
            },
            unit: { type: Number, require: true },
         },
      ],
      orders: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
         },
      ],
   },
   {
      toJSON: {
         transform(doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
         },
      },
      timestamps: true,
   }
);

const Customer = mongoose.model("Customer", CustomerSchema);
module.exports = Customer;
