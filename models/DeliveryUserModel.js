const mongoose = require("mongoose");

const DeliveryUserSchema = new mongoose.Schema(
   {
      email: { type: String, required: true },
      password: { type: String, required: true },
      salt: { type: String, required: true },
      firstName: { type: String },
      lastName: { type: String },
      address: { type: String },
      phone: { type: String, required: true },
      pincode: { type: String, required: true },
      verified: { type: Boolean },
      otp: { type: Number },
      otp_expiry: { type: Date },
      lat: { type: Number },
      lng: { type: Number },
      isAvailable: { type: Boolean, default: false },
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

const DeliveryUser = mongoose.model("DeliveryUser", DeliveryUserSchema);
module.exports = DeliveryUser;
