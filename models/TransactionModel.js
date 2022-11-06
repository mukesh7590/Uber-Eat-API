const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
   {
      customer: String,
      vendorId: String,
      orderId: String,
      orderValue: Number,
      offerUsed: String,
      status: String,
      paymentMode: String,
      paymentResponse: String,
   },
   {
      toJSON: {
         transform(doc, ret) {
            delete ret.__v;
         },
      },
      timestamps: true,
   }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;
