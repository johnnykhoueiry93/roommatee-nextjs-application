// /api/resendVerificationToken
import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../utils/database"; // Adjust the import path based on your project structure
const logger = require("../../../utils/logger");
const generateNumericCode = require('../../../utils/generateCodes.js');
const emailModule = require('../../../utils/emailUtils')

export async function POST(request) {
    try {
      const { emailAddress } = await request.json();
  
      logger.info(`[${emailAddress}] - [/api/resendVerificationToken] - Received request to resend verification token after sign up.`)
  
      // Generate a random verification code
      const verificationCode = generateNumericCode();

      const user = {
        verificationCode,
        emailAddress
      };

      // Execute the query with parameters
      const results = await executeQuery("SELECT * FROM userprofile WHERE emailAddress = ?", [emailAddress]);

      let firstName;
      // @ts-ignore
      if (results.length > 0) {
        // @ts-ignore
        firstName = results[0].firstName;
      }

      const verificateCodeUpdateResults = await executeQuery("UPDATE userprofile SET verificationCode = ? where emailAddress = ?", [verificationCode, emailAddress]);
  
      if(verificateCodeUpdateResults.affectedRows > 0 ) {
        emailModule.sendEmailVerificationCode(verificationCode, firstName, emailAddress);
        return NextResponse.json({ message: "Verification code sent again." }, { status: 200 });
      } else {
        return NextResponse.json({ message: "No rows returned. We should not be here" }, { status: 500 });
      }
  
    } catch (err) {
      logger.error(`[${emailAddress}] - [/api/resendVerificationToken] - Root Cause: `, err);
      return NextResponse.json({ message: "Error setting up a new sign up verification token", error: err.message }, { status: 500 });
    }
  }