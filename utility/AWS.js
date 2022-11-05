const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

aws.config.update({
   secretAccessKey: process.env.ACCESS_SECRET,
   accessKeyId: process.env.ACCESS_KEY,
   region: process.env.REGION,
});
const BUCKET = process.env.BUCKET;
const s3 = new aws.S3();

const upload = multer({
   storage: multerS3({
      s3: s3,
      acl: "public-read",
      bucket: BUCKET,
      key: function (req, file, cb) {
         console.log(file);
         cb(null, file.originalname);
      },
   }),
});

module.exports = {
   upload,
};
