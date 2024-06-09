// /api/createNewRoomListing

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


export async function POST(request) {
  try {
    const formData = await request.formData();

    // Verify formData contents
    for (const [key, value] of formData.entries()) {
      console.log(`Key: ${key}, Value: ${value}`);
    }

    // Convert boolean strings to integers
    const convertBooleanToInt = (value) => (value == "true" ? 1 : 0);

    const emailAddress = formData.get("emailAddress");
    const userProfileId = formData.get("userProfileId");

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
    const results = await executeQuery( "INSERT INTO roomListings SET ?", roomListingData );

    if (results.affectedRows > 0) {
      const lastInsertedListingId = results.insertId;
      logger.info( `[${emailAddress}] - [/api/createNewRoomListing] - New Room listing with id: ${lastInsertedListingId} inserted successfully` );
      

        // Upload pictures to S3
      const pictures = formData.getAll("pictures");
      const uploadedPictureUrls = [];
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

        const data = await s3.upload(params).promise();
        uploadedPictureUrls.push(data.Location);
      }

      roomListingData.pictures = uploadedPictureUrls;

      const results_v2 = await executeQuery(`UPDATE roomListings set picture1='${arrayPictures[0]}' , picture2='${arrayPictures[1]}' , picture3='${arrayPictures[2]}' , picture4='${arrayPictures[3]}' WHERE id = ${lastInsertedListingId}` );

      if(results_v2.affectedRows > 0 ) {
        logger.info('Picture update success');
      } else {
        logger.error('Picture update failed');
      }

      return NextResponse.json(
        { message: "Signup successful" },
        { status: 200 }
      );

    } else {
      throw new Error("Failed to insert listing");
    }
  } catch (err) {
    logger.error(
      `Backend failure during the /api/createNewRoomListing webservice`,
      err
    );
    return NextResponse.json(
      { message: "Internal server error", error: err.message },
      { status: 500 }
    );
  }
}
