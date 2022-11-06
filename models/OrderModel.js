const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
   {
      orderId: { type: String, require: true },
      vendorId: { type: String, require: true },
      items: [
         {
            food: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Food",
               require: true,
            },
            unit: { type: Number, require: true },
         },
      ],
      totalAmount: { type: Number, require: true },
      paidAmount: { type: Number, require: true },
      orderDate: { type: Date },
      orderStatus: { type: String },
      remarks: { type: String },
      deliveryId: { type: String },
      readyTime: { type: Number },
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

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
