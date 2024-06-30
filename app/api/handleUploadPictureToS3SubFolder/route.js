// Import necessary modules
import AWS from 'aws-sdk';
import { NextResponse } from 'next/server';
import { Buffer } from 'buffer';
const logger = require("../../../utils/logger");

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// POST function handling file upload
export async function POST(request) {
  try {
    logger.info('Received request for profile picture upload' );

    // Parse the FormData from request body
    const formData = await request.formData();

    // Extract fields from FormData
    const userId = formData.get('userId');
    const emailAddress = formData.get('emailAddress');
    const s3SubFolderPath = formData.get('s3SubFolderPath');
    const selectedFile = formData.get('selectedFile');

    // Ensure selectedFile exists and convert to Buffer
    const fileBuffer = Buffer.from(await selectedFile.arrayBuffer());

    // Set S3 upload parameters
    const params = {
      Bucket: process.env.S3_UPLOAD_BUCKET_NAME,
      Key: `${s3SubFolderPath}/${userId}-${s3SubFolderPath}.png`,
      Body: fileBuffer,
      ContentType: selectedFile.type,
      ACL: 'public-read',
    };

    // Upload file to S3
    const uploadResult = await s3.upload(params).promise();

    // Return success response with uploaded file URL
    return NextResponse.json({ success: true, message: 'File uploaded successfully', imageUrl: uploadResult.Location }, { status: 200 });

  } catch (error) {
    logger.error('Error handling file upload:', error);
    console.error('Error handling file upload:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



// // Import necessary modules
// import AWS from 'aws-sdk';
// import { NextResponse } from 'next/server';
// import { Buffer } from 'buffer';
// const logger = require("../../../utils/logger");

// // Configure AWS S3
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// // POST function handling file upload
// export async function POST(request) {
//   logger.info('Received request for profile picture upload' );

//   try {
//     // Parse the body as text since request.body() is not working as expected
//     const body = await request.text();

//     // Parse FormData manually
//     const formData = {};
//     const boundary = body.split('\r\n')[0].split('; ')[1].replace('boundary=', '');

//     // Split body into parts
//     const parts = body.split(`--${boundary}`);

//     // Process each part
//     for (let part of parts) {
//       // Check if it's a valid part
//       if (part.trim() !== '' && part.trim() !== '--') {
//         // Split part into headers and content
//         const [head, content] = part.split('\r\n\r\n');

//         // Get headers
//         const headers = head.split('\r\n').reduce((acc, header) => {
//           const [key, value] = header.split(': ');
//           acc[key.toLowerCase()] = value;
//           return acc;
//         }, {});

//         // Get name and value from content
//         const name = /name="(.+?)"/.exec(headers['content-disposition'])[1];
//         const value = content.trim();

//         // Store in formData
//         formData[name] = value;
//       }
//     }

//     // Destructure formData
//     const { userId, emailAddress, s3SubFolderPath } = formData;

//     // Access the file data from FormData
//     const fileBoundary = `--${boundary}--`;
//     const fileContent = body.substring(body.indexOf(boundary) + boundary.length + 4, body.indexOf(fileBoundary));

//     // Convert file content to buffer
//     const fileBuffer = Buffer.from(fileContent, 'base64');

//     // Set S3 upload parameters
//     const params = {
//       Bucket: process.env.S3_UPLOAD_BUCKET_NAME,
//       Key: `${s3SubFolderPath}/${userId}-${s3SubFolderPath}.png`,
//       Body: fileBuffer,
//       ContentEncoding: 'base64', // Ensure correct encoding for base64 data
//       ContentType: 'image/png', // Set content type based on your file type
//       ACL: 'public-read', // Adjust permissions as needed
//     };

//     // Upload file to S3
//     const uploadResult = await s3.upload(params).promise();

//     // Return success response with uploaded file URL
//     return NextResponse.json({ success: true, message: 'File uploaded successfully', imageUrl: uploadResult.Location }, { status: 200 });

//   } catch (error) {
//     // Handle errors
//     logger.error('Error handling file upload:', error);
//     console.error('Error handling file upload:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }
