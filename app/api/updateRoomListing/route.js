// /api/updateRoomListing

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


  async function uploadListingPictures(userProfileId, lastInsertedListingId, pictures, emailAddress) {
    try {
      const arrayPictures = [];
  
      for (const picture of pictures) {
        const buffer = Buffer.from(await picture.arrayBuffer());
        const newFilename = `${userProfileId}_${lastInsertedListingId}_${picture.name}`;
        arrayPictures.push(newFilename);
  
        const params = {
          Bucket: process.env.S3_UPLOAD_BUCKET_NAME,
          Key: newFilename,
          Body: buffer,
          ContentType: picture.type,
        };
  
        await s3.upload(params).promise();
      }
  
      // Join the array of picture filenames into a CSV string
      const csvPictures = arrayPictures.join(',');

      const result = await executeQuery(`UPDATE roomListings SET pictures='${csvPictures}' WHERE id = ${lastInsertedListingId}`);

      if (result.affectedRows > 0) {
        return true;
      } else {
        logger.error(`[${emailAddress}] - [uploadListingPictures] - Failed to upload pictures for listing id: ${lastInsertedListingId}`);
        return false;
      }
    } catch (error) {
      logger.error(`[${emailAddress}] - [uploadListingPictures] - Error during picture upload: ${error.message} for listing id: ${lastInsertedListingId}`);
      return false;
    }
  }




export async function POST(request) {
  try {
    logger.info()
    const formData = await request.formData();
    const emailAddress = formData.get("emailAddress");

    // Verify formData contents
    for (const [key, value] of formData.entries()) {
      console.log(`Key: ${key}, Value: ${value}`);
    }

    logger.info(`[${emailAddress}] - [/api/updateRoomListing] - WS request received to update existing place listing with id`);

    // Convert boolean strings to integers
    const convertBooleanToInt = (value) => (value == "true" ? 1 : 0);

    const userProfileId = formData.get("userProfileId");
    const listingId = formData.get("id");

    const roomListingData = {
      userProfileId: formData.get("userProfileId"),
      listingType: formData.get("listingType"),
      price: formData.get("price"),
      moveInDate: formData.get("moveInDate"),
      leaseDurationInMonth: formData.get("leaseDurationInMonth"),
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      country: formData.get("country"),
      zip: formData.get("zip"),
      genderPreference: formData.get("genderPreference"),
      agePreference: formData.get("agePreference"),
      minAge: formData.get("minAge"),
      maxAge: formData.get("maxAge"),
      privateBathroom: convertBooleanToInt(formData.get("privateBathroom")),
      privateParking: convertBooleanToInt(formData.get("privateParking")),
      publicParking: convertBooleanToInt(formData.get("publicParking")),
      internetConnection: convertBooleanToInt(formData.get("internetConnection")),
      washer: convertBooleanToInt(formData.get("washer")),
      dryer: convertBooleanToInt(formData.get("dryer")),
      dishWasher: convertBooleanToInt(formData.get("dishWasher")),
      wheelChairAccessibility: convertBooleanToInt( formData.get("wheelChairAccessibility")),
      floor: formData.get("floor"),
      petFriendly: convertBooleanToInt(formData.get("petFriendly")),
      refrigerator: convertBooleanToInt(formData.get("refrigerator")),
      microwave: convertBooleanToInt(formData.get("microwave")),
      smokingAllowed: convertBooleanToInt(formData.get("smokingAllowed")),
      furnished: convertBooleanToInt(formData.get("furnished")),
      television: convertBooleanToInt(formData.get("television")),
      airConditionning: convertBooleanToInt(formData.get("airConditionning")),
      heating: convertBooleanToInt(formData.get("heating")),
      fireplace: convertBooleanToInt(formData.get("fireplace")),
      smokeAlarm: convertBooleanToInt(formData.get("smokeAlarm")),
      dishes: convertBooleanToInt(formData.get("dishes")),
      toaster: convertBooleanToInt(formData.get("toaster")),
      coffeeMaker: convertBooleanToInt(formData.get("coffeeMaker")),
      bedSize: formData.get("bedSize"),
      description: formData.get("description"),
      latitude: formData.get("latitude"),
      longitude: formData.get("longitude"),
    };

    console.log("roomListingData:", roomListingData);

    // Execute the query with parameters
    const results = await executeQuery( "UPDATE roomListings SET ? WHERE id = ?", [roomListingData, listingId] );

    if (results.affectedRows > 0) {
  
          // Upload pictures to S3
        const pictures = formData.getAll("pictures");
        
        if (pictures && pictures.length > 0) {
              const uploadResult = await uploadListingPictures(userProfileId, listingId, pictures, emailAddress);
  
                /**
               * If uploadResult is true means that:
               * 1- the insert into the databse was a success
               * 2- The picture upload was a success
               * 3- the database update with the pictures is a success
               */
              if (uploadResult) {
                logger.info( `[${emailAddress}] - [/api/updateRoomListing] - Room listing with id: ${listingId} updated successfully and pictures uploaded to S3` );
                return NextResponse.json(
                    { message: "Listing updated successfully!" },
                    { status: 200 }
                  );
              } else {
                return NextResponse.json(
                    { message: "Listing failed to update!" },
                    { status: 500 }
                  );
              }
  
        } else {
              logger.info( `[${emailAddress}] - [/api/updateRoomListing] -  Room listing with id: ${listingId} updated successfully. No pictures provided.` );
              return NextResponse.json(
                { message: "Listing updated successfully!" },
                { status: 200 }
              );
        }
        
  
      } else {
        throw new Error("Failed to insert listing");
      }
  } catch (err) {
    logger.error(
      `Backend failure during the /api/updateRoomListing webservice`,
      err
    );
    return NextResponse.json(
      { message: "Internal server error", error: err.message },
      { status: 500 }
    );
  }
}
