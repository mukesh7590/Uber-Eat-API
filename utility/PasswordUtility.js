const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const GenerateSalt = async () => {
   return await bcrypt.genSalt();
};

const GeneratePassword = async (password, salt) => {
   return await bcrypt.hash(password, salt);
};

const ValidatePassword = async (enteredPassword, savedPassword, salt) => {
   return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

const GenerateSignature = (payload) => {
   return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "60d" });
};

// const ValidateSignature = async (req) => {
//    const signature = req.get("Authorization");
//    if (signature) {
//       const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
//       req.user = payload;
//       return true;
//    }
//    return false;
// };

module.exports = {
   GeneratePassword,
   GenerateSalt,
   GenerateSignature,
   ValidatePassword,
};
