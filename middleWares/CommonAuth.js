// const ValidateSignature = require("../utility/PasswordUtility");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const Authenticate = asyncHandler(async (req, res, next) => {
   let token;
   if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
   ) {
      try {
         token = req.headers.authorization.split(" ")[1];
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         req.user = decoded;
         next();
      } catch (error) {
         console.log(error);
         res.status(401);
         throw new Error("Not authorized");
      }
   }

   if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
   }
});

const verifyToken = (req, res, next) => {
   Authenticate(req, res, () => {
      if (req.user) {
         next();
      } else {
         res.status(403).json("You are not alowed to do that!");
      }
   });
};

module.exports = {
   Authenticate,
   verifyToken,
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

// const Authenticate = async (req, res, next) => {
//    const signature = await ValidateSignature(req);
//    if (signature) {
//       return next();
//    } else {
//       return res.json({ message: "User Not authorised" });
//    }
// };
// module.exports = {
//    Authenticate,
// };
