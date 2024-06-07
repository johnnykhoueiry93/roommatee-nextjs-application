const AWS = require('aws-sdk');
const fs = require('fs');
const logger = require('./logger'); // Import your logger module

const S3_UPLOAD_BUCKET_NAME = process.env.S3_UPLOAD_BUCKET_NAME;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION;

// Set your AWS credentials from environment variables
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

// Create an S3 instance
const s3 = new AWS.S3();

/**
 * This function will allow you to upload a single file to AWS S3
 * Parameters consumed
 * @param {*} fileToUpload 
 * @param {*} key 
 * @param {*} callback 
 */
//@ts-ignore
const uploadSinglePictureToS3 = (emailAddress, fileToUpload, key, callback) => {
  // Read the file
  const fileContent = fs.readFileSync(fileToUpload);

  // Set the parameters for S3 upload
  const params = {
    Bucket: S3_UPLOAD_BUCKET_NAME,
    Key: key,
    Body: fileContent,
  };

  // Upload the file to S3
  //@ts-ignore
  s3.upload(params, (err, data) => {
    if (err) {
      logger.error("Error uploading file:", err);
      callback(err, null);
    } else {
      logger.info(`[${emailAddress}] - [/uploadSinglePictureToS3] - File uploaded successfully to: ${key}`);

      // Delete the local file after uploading to S3
      fs.unlinkSync(fileToUpload);

      // You can perform additional actions here, such as updating the user's profile with the S3 URL

      callback(null, data.Location);
    }
  });
};

module.exports = { uploadSinglePictureToS3 };
