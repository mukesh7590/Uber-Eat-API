const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      ownerName: { type: String, required: true },
      foodType: { type: [String] },
      pincode: { type: String, required: true },
      address: { type: String },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
      salt: { type: String, required: true },
      serviceAvailable: { type: Boolean },
      coverImages: { type: [String] },
      rating: { type: Number },
      foods: [
         {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "food",
         },
      ],
      lat: { type: Number },
      lng: { type: Number },
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

const Vendor = mongoose.model("Vendor", VendorSchema);
module.exports = Vendor;
