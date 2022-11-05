const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
   {
      vendorId: { type: String, required: true },
      name: { type: String, required: true },
      description: { type: String, required: true },
      category: { type: String },
      foodType: { type: String, required: true },
      readyTime: { type: Number },
      price: { type: Number },
      rating: { type: Number },
      images: { type: [String] },
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

const Food = mongoose.model("Food", FoodSchema);
module.exports = Food;
