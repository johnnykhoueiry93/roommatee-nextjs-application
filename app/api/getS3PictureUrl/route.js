
// #####################################################  CODE BELOW NOOOOOO CACHE #####################################################

// // /api/getS3PictureUrl
// import AWS from 'aws-sdk';
// import { NextResponse } from 'next/server';
// const logger = require("../../../utils/logger");

// const S3_UPLOAD_BUCKET_NAME = process.env.S3_UPLOAD_BUCKET_NAME;


//   // Initialize AWS SDK with configuration options
//   const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION,
//   });

// export async function POST(request) {
//   // console.log('[getS3PictureUrl] request received');
//   const { searchParams } = new URL(request.url);
//   const key = searchParams.get('key');
//   const folder = searchParams.get('folder');

//   if (!key) {
//     return NextResponse.json({ error: 'Key parameter is missing' }, { status: 400 });
//   }

//   // Construct S3 parameters
//   let s3Key = folder ? `${folder}/${key}` : key;

//   const params = {
//     Bucket: S3_UPLOAD_BUCKET_NAME,
//     Key: s3Key,
//     Expires: 7200, // 2 hours
//   };

//   try {
//     const url = s3.getSignedUrl('getObject', params);
//     return NextResponse.json({ s3Url: url } , { status: 200 });
//   } catch (error) {
//     logger.error('Error generating S3 signed URL:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }




// #####################################################  CODE BELOW CACHES #####################################################

// /api/getS3PictureUrl
import AWS from 'aws-sdk';
import { NextResponse } from 'next/server';
const logger = require("../../../utils/logger");
import NodeCache from 'node-cache';

const S3_UPLOAD_BUCKET_NAME = process.env.S3_UPLOAD_BUCKET_NAME;

// Initialize AWS SDK with configuration options
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Initialize NodeCache
const cache = new NodeCache({ stdTTL: 7200 }); // TTL (Time to Live) is 2 hours

export async function POST(request) {
  // console.log('[getS3PictureUrl] request received');
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  const folder = searchParams.get('folder');

  if (!key) {
    return NextResponse.json({ error: 'Key parameter is missing' }, { status: 400 });
  }

  // Construct S3 parameters
  let s3Key = folder ? `${folder}/${key}` : key;

  // Check cache first
  const cachedUrl = cache.get(s3Key);
  if (cachedUrl) {
    console.log("Returning cache responses")
    return NextResponse.json({ s3Url: cachedUrl }, { status: 200 });
  }

  const params = {
    Bucket: S3_UPLOAD_BUCKET_NAME,
    Key: s3Key,
    Expires: 7200, // 2 hours
  };

  try {
    const url = s3.getSignedUrl('getObject', params);

    // Store the URL in cache
    cache.set(s3Key, url);

    return NextResponse.json({ s3Url: url }, { status: 200 });
  } catch (error) {
    logger.error('Error generating S3 signed URL:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
