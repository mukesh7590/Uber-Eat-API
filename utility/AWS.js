const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const ACCESS_SECRET = "AKIAYDZMZPUNTTUY7KPB";
const ACCESS_KEY = "Yc95xMNWSj+2JKfnc+R7ZD4DtQ59RMvYCtH3wQGz";
const REGION = "ap-south-1";
const BUCKET = "uber-eat-api-images-bucket";

aws.config.update({
   secretAccessKey: ACCESS_KEY,
   accessKeyId: ACCESS_SECRET,
   region: REGION,
});

const s3 = new aws.S3();

const upload = multer({
   storage: multerS3({
      s3: s3,
      acl: "public-read",
      bucket: BUCKET,
      key: function (req, image, cb) {
         console.log(image);
         cb(null, image.originalname);
      },
   }),
});

module.exports = {
   upload,
};
