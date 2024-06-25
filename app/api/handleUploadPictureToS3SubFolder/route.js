// /api/handleUploadPictureToS3SubFolder

import AWS from 'aws-sdk';
import { NextResponse } from 'next/server';
const logger = require("../../../utils/logger");
import { Buffer } from 'buffer';


export async function POST(request) {
  try {
      // Parse the body manually since bodyParser is disabled
      const body = await request.text();
      const { userId, emailAddress, selectedFile, s3SubFolderPath } = JSON.parse(body);

      logger.info(`[${emailAddress}] - [/api/handleUploadPictureToS3SubFolder] - Received WS request with parameter: ${s3SubFolderPath}`);

      // Decode base64 file to buffer
      const fileBuffer = Buffer.from(selectedFile, 'base64');

      // Initialize AWS SDK with configuration options
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

      const params = {
          Bucket: process.env.S3_UPLOAD_BUCKET_NAME,
          Key: `${s3SubFolderPath}/${userId}-${s3SubFolderPath}.png`,
          Body: fileBuffer,
          ContentEncoding: 'base64',
          ContentType: 'image/png',
          ACL: 'public-read',
      };

      const uploadResult = await s3.upload(params).promise();

      // You can do additional processing or return data as needed
      return NextResponse.json({ success: true, message: 'File uploaded successfully', imageUrl: uploadResult.Location }, { status: 200 });

  } catch (error) {
      // Handle errors
      console.error(error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
