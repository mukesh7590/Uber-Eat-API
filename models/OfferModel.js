const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema(
   {
      offerType: { type: String, require: true },
      vendors: [{ type: Schema.Types.ObjectId, ref: "Vendor" }],
      title: { type: String, require: true },
      description: { type: String },
      minValue: { type: Number, require: true },
      offerAmount: { type: Number, require: true },
      startValidity: Date,
      endValidity: Date,
      promocode: { type: String, require: true },
      promoType: { type: String, require: true },
      bank: [{ type: String }],
      bins: [{ type: Number }],
      pincode: { type: String, require: true },
      isActive: Boolean,
   },
   {
      toJSON: {
         transform(doc, ret) {
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
         },
      },
      timestamps: true,
   }
);

const Offer = mongoose.model("Offer", OfferSchema);
module.exports = Offer;
