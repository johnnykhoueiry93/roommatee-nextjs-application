// /api/getListingPicturesURL

/**
 * This route will return all the URLs of the listing
 * and will populate the Carousel
 */

import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../utils/database"; 
import AWS from 'aws-sdk';
const logger = require("../../../utils/logger");

// const S3_UPLOAD_BUCKET_NAME = process.env.S3_UPLOAD_BUCKET_NAME;

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: 'us-east-2',
// });

// const s3 = new AWS.S3();

// export async function POST(request) {
//   console.log('[getS3PictureUrl] request received');
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
//     Expires: 3600,
//   };

//   try {
//     const url = s3.getSignedUrl('getObject', params);
//     return NextResponse.json({ s3Url: url } , { status: 200 });
//   } catch (error) {
//     console.error('Error generating S3 signed URL:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }



export async function POST(request) {
  try {
    const { listingId, emailAddress } = await request.json();

    logger.info(`[${emailAddress}] - [/getListingPicturesURL] - Getting the listing picture URLs for listingId: ${listingId}`);

    // Execute the query with parameters
    const results = await executeQuery(
      "SELECT pictures FROM roomListings JOIN userprofile ON roomListings.userProfileId = userprofile.id WHERE roomListings.id = ?",
      [listingId]
    );

    if (results.length > 0 && results[0].pictures) {
      const pictures = results[0].pictures.split(','); // Split the pictures string into an array
      console.log("pictures: " , pictures);
      return NextResponse.json({ message: "Results found", pictures: pictures }, { status: 200 });
    } else {
      return NextResponse.json({ message: "No results found" });
    }

  } catch (err) {
    logger.error(`Backend failure during the /api/getListingPicturesURL webservice`, err);
    return NextResponse.json({ message: "Internal server error", error: err.message }, { status: 500 });
  }
}
