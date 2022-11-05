const mongoose = require("mongoose");

const connectDB = async () => {
   try {
      const conn = await mongoose.connect(process.env.MONGO_URL);

      console.log("\n\t\t\t\tMongoDB Connection Established");
   } catch (error) {
      console.log(error);
      process.exit(1);
   }
};
module.exports = connectDB;
