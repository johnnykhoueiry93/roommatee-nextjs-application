// /api/login

import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../utils/database"; // Adjust the import path based on your project structure
import admin from "../../../utils/firebaseAdmin";
const logger = require("../../../utils/logger");
const passwordUtils = require("../../../utils/passwordUtils");

async function incrementLoginFrequencyAndLastLogin(emailAddress) {
  try {
    await executeQuery("UPDATE userprofile SET loginCounter = loginCounter + 1 , lastLoginDate = CURRENT_TIMESTAMP where emailAddress = ?", emailAddress);
  } catch (error) {
    logger.error(`[${emailAddress}] - [/api/login] - Failed to update the login counter and last login date`);
  }
}

export async function POST(request) {
  try {
    const { emailAddress, password: plainPassword } = await request.json();

    logger.info(`[${emailAddress}] - User attempting to login with email: ${emailAddress}`);
    logger.info(`[${emailAddress}] - Received plain password: ${plainPassword}`);

    // Execute the query with parameters
    const results = await executeQuery("SELECT * FROM userprofile WHERE emailAddress = ?", [emailAddress]);

    //@ts-ignore
    if (results.length > 0) {
      const hashedPassword = results[0].password;
      const passwordMatch = await passwordUtils.comparePassword(plainPassword, hashedPassword);

      if (passwordMatch) {
        logger.info(`[${emailAddress}] - Login was successful`);

        await incrementLoginFrequencyAndLastLogin(emailAddress);

        // Update the lastLoginDate in the results object
        results[0].lastLoginDate = new Date().toISOString();

        const firebaseToken = await admin.auth().createCustomToken(emailAddress);
        logger.info(`[${emailAddress}] - [/api/login] - Firestore token generated: ${firebaseToken}`);

        const responseData = {
          user: results[0], // Assuming results[0] contains user details
          firebaseToken,
        };

        return NextResponse.json(responseData);
      } else {
        logger.info(`[${emailAddress}] - Login failed - Wrong username/password!`);
        return NextResponse.json({ message: "Wrong username/password!" }, { status: 401 });
      }
    } else {
      logger.info(`[${emailAddress}] - Login failed - User not found!`);
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }
  } catch (err) {
    logger.error(`Backend failure during the /login webservice`, err);
    // logPoolStatus();
    return NextResponse.json({ message: "Internal server error", error: err.message }, { status: 500 });
  }
}
