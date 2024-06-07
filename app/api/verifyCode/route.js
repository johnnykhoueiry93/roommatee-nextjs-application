// /api/verifyCode

import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../utils/database"; // Adjust the import path based on your project structure
const logger = require("../../../utils/logger");

async function setEmailVerified(isEmailVerified, emailAddress) {
    try {
  
      // Execute the query with parameters
      const results = await executeQuery("UPDATE userprofile SET isEmailVerified = ? WHERE emailAddress = ?", [isEmailVerified, emailAddress]);
  
      if(results.affectedRows > 0 ) {
        logger.info(`[${emailAddress}] - Email is now verified`);
      }
  
    } catch (err) {
        logger.error(`[${emailAddress}] - Failed to update the isEmail verified to true: Root Cause: ` + err );
      return NextResponse.json({ message: "Internal server error", error: err.message }, { status: 500 });
    }
  }


export async function POST(request) {
  try {
    const { verificationCode, emailAddress } = await request.json();

    logger.info(`[${emailAddress}] - [/verifyCode] - Backend verification started for email: ${emailAddress} and code: ${verificationCode}`);

    // Execute the query with parameters
    const results = await executeQuery("SELECT emailAddress FROM userprofile WHERE emailAddress = ? AND verificationCode = ?", [emailAddress, verificationCode]);

    if(results.length > 0 ) {
        await setEmailVerified(true, emailAddress);
        return NextResponse.json({ message: "Email is now verified." }, { status: 200 });
    } else {
        logger.info( `[${emailAddress}] - [/verifyCode] - The verification code: ${verificationCode} provided for the user: ${emailAddress} is invalid` );
        return NextResponse.json({ message: `Invalid Verification Code` }, { status: 401 });
    }

  } catch (err) {
    logger.error(`Backend failure during the /api/changePassword webservice`, err);
    return NextResponse.json({ message: "Internal server error", error: err.message }, { status: 500 });
  }
}
