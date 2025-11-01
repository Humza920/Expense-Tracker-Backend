const { v2: cloudinary } = require('cloudinary');
const { Readable } = require('stream');
const dotenv = require("dotenv")
dotenv.config()

console.log(process.env.CLOUD_NAME , process.env.CLOUD_API_KEY, process.env.CLOUD_API_SECRET);
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadToCloudinary = (buffer) => {

    

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "ExpenseTracker" },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
};

module.exports = { cloudinary, uploadToCloudinary };