// /api/insertProfileSetupInfo

import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../utils/database"; // Adjust the import path based on your project structure
const logger = require("../../../utils/logger");

export async function POST(request) {
  const { welcomeProfileSetupStep, emailAddress } = await request.json();

  try {

    logger.info(`[${emailAddress}] - [/api/insertProfileSetupInfo] - The user is completing their profile`);

    const {
        isProfileComplete,
        dob,
        age,
        budget,
        citiesLookingToLiveIn,
        isLookingForRoommate,
        gender,
        userHasAPlace,
        typeOfPlace,
        minAge,
        maxAge,
        socialStatus,
        socialstatusDetails,
        isSmoker,
        hasPet,
        cleanlinessLevel,
        emailNotificationEnabled,
        chatNotificationEnabled,
        newListingNotificationEnabled,
        showEmailAddressToPublic,
        showPhoneNumberToPublic,
        showSocialMediatoPublic,   
        showAgeToPublic,
        showGenderToPublic, 
        bio,
        languages,
        hasKids,
        preferredFurnishedPlace,
        preferredLeaseTerm,
        phoneNumber,
        roommateCount,
        moveInDate,
      } = welcomeProfileSetupStep;

      console.log("Pringint the fill welcomeProfileSetupStep: " , welcomeProfileSetupStep);

      // Convert typeOfPlace to a comma-separated string if it's an array
      const typeOfPlaceStr = Array.isArray(typeOfPlace) ? typeOfPlace.join(',') : typeOfPlace;

      // Convert typeOfPlace to a comma-separated string if it's an array
      const citiesLookingToLiveInStr = Array.isArray(citiesLookingToLiveIn) ? citiesLookingToLiveIn.join(',') : citiesLookingToLiveIn;

      // Convert languages to a comma-separated string if it's an array
      const languagesStr = Array.isArray(languages) ? languages.join(',') : languages;

        // Build the SQL query string conditionally based on the presence of values
      // the purpose behind this is to only update values if they are provided by the frontend
      // Reminder: Some sections will send 3 values to update, some sections will send 7 values to update
      // this logic will ensure that we're updating only the values returned
      let sql = "UPDATE userprofile SET";

      const updateValues = [];
      const updateFields = [
        { value: dob, field: 'dob' },
        { value: age, field: 'age' },
        { value: budget, field: 'budget' },
        { value: citiesLookingToLiveInStr, field: 'citiesLookingToLiveIn' },
        { value: isLookingForRoommate, field: 'isLookingForRoommate' },
        { value: gender, field: 'gender' },
        { value: userHasAPlace, field: 'userHasAPlace' },
        { value: typeOfPlaceStr, field: 'typeOfPlace' },
        { value: minAge, field: 'minAge' },
        { value: maxAge, field: 'maxAge' },
        { value: socialStatus, field: 'socialStatus' },
        { value: socialstatusDetails, field: 'socialstatusDetails' },
        { value: isSmoker, field: 'isSmoker' },
        { value: hasPet, field: 'hasPet' },
        { value: cleanlinessLevel, field: 'cleanlinessLevel' },
        { value: emailNotificationEnabled, field: 'emailNotificationEnabled' },
        { value: chatNotificationEnabled, field: 'chatNotificationEnabled' },
        { value: newListingNotificationEnabled, field: 'newListingNotificationEnabled' },
        { value: showEmailAddressToPublic, field: 'showEmailAddressToPublic' }, 
        { value: showPhoneNumberToPublic, field: 'showPhoneNumberToPublic' },
        { value: showSocialMediatoPublic, field: 'showSocialMediatoPublic' },
        { value: showGenderToPublic, field: 'showGenderToPublic' },
        { value: showAgeToPublic, field: 'showAgeToPublic' },
        { value: bio, field: 'bio' },
        { value: languagesStr, field: 'languages' },
        { value: hasKids, field: 'hasKids' },
        { value: preferredFurnishedPlace, field: 'preferredFurnishedPlace' },
        { value: preferredLeaseTerm, field: 'preferredLeaseTerm' },
        { value: phoneNumber, field: 'phoneNumber' },
        { value: roommateCount, field: 'roommateCount' },
        { value: moveInDate, field: 'moveInDate' },
        { value: '1', field: 'isProfileComplete' },
      ];

      updateFields.forEach(({ value, field }) => {
        if (value !== undefined && value !== null && value !== '') {
          sql += ` ${field}=?,`;
          updateValues.push(value);
        }
      });


      sql = sql.slice(0, -1); // Remove the last comma
      sql += ` WHERE emailAddress=?`;

      updateValues.push(emailAddress);

      logger.info(`[${emailAddress}] - [/api/insertProfileSetupInfo] - SQL Query: ${sql}`);
      logger.info(`[${emailAddress}] - [/api/insertProfileSetupInfo] - Update Values: ${updateValues.join(', ')}`);

    // Execute the query with parameters
    const results = await executeQuery(sql, updateValues);

    if(results.affectedRows > 0 ) {
        logger.info(`[${emailAddress}] - [/api/insertProfileSetupInfo] - Profile Setup data update completed successfully.`);
        return NextResponse.json({ message: "Profile setup info updated successfully." }, { status: 200 });
    } else {
      logger.info(`[${emailAddress}] - [/api/insertProfileSetupInfo] - No rows affected during the update process.`);
        return NextResponse.json({ message: `Invalid Verification Code` }, { status: 401 });
    }

  } catch (err) {
    logger.error(`[${emailAddress}] - [/api/insertProfileSetupInfo] - Error executing query: ${err.message}`);
    return NextResponse.json({ message: "Internal server error", error: err.message }, { status: 500 });
  }
}
