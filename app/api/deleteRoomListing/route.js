// /api/deleteRoomListing

import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../utils/database";
import AWS from "aws-sdk";
const logger = require("../../../utils/logger");

// Configure the AWS SDK
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  // Delete from S3 48_232_new1.PNG
  // Delete from S3 userProfileId_listingId_*
  async function deleteAssociatedListingPictures(userProfileId, listingId, emailAddress) {
    try {
      const params = {
        Bucket: process.env.S3_UPLOAD_BUCKET_NAME,
        Prefix: `${userProfileId}_${listingId}`,
      };

    const data = await s3.listObjectsV2(params).promise();


    if (data.Contents.length === 0) {
      console.log('No matching objects found.');
      return;
    }

    const deleteParams = {
      Bucket: process.env.S3_UPLOAD_BUCKET_NAME,
      Delete: { Objects: data.Contents.map(obj => ({ Key: obj.Key })) },
    };

    await s3.deleteObjects(deleteParams).promise();

    logger.info(`[${emailAddress}] - [deleteAssociatedListingPictures] - Listing pictures with prefix pattern ${userProfileId}_${listingId} were deleted successfully`)

    } catch (error) {
      logger.error(`[${emailAddress}] - [deleteAssociatedListingPictures] - Error while deleting pictures with prefix pattern ${userProfileId}_${listingId}`);
      return false;
    }
  }

export async function POST(request) {
  try {
    logger.info()
    const formData = await request.formData();

    const userProfileId = formData.get("userProfileId");
    const emailAddress = formData.get("emailAddress");
    const listingId = formData.get("id");

    // Verify formData contents
    for (const [key, value] of formData.entries()) {
      console.log(`Key: ${key}, Value: ${value}`);
    }

    logger.info(`[${emailAddress}] - [/api/deleteRoomListing] - WS request received to delete existing place listing with id: ${listingId}`);

    // Execute the query with parameters
    const results = await executeQuery( "DELETE FROM roomListings WHERE id = ?", listingId );

    if (results.affectedRows > 0) {

      logger.info(`[${emailAddress}] - [/api/deleteRoomListing] - Room listing with id: ${listingId} deleted successfully.` );
      deleteAssociatedListingPictures(userProfileId, listingId, emailAddress);

      return NextResponse.json(
                    { message: "Listing deleted successfully!" },
                    { status: 200 })
  
  
      } else {
        throw new Error("Failed to insert listing");
      }
  } catch (err) {
    logger.error(`[${emailAddress}] - [/api/deleteRoomListing] - Failed to delete listing with id: ${listingId}. Root Cause: `,err);
    return NextResponse.json(
      { message: "Failed to delete listing", error: err.message },
      { status: 500 }
    );
  }
}
