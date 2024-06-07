// /api/signup

import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../utils/database"; // Adjust the import path based on your project structure
const logger = require("../../../utils/logger");
const generateNumericCode = require('../../../utils/generateCodes.js');
const passwordUtils = require("../../../utils/passwordUtils");

async function checkIfEmailAlreadyRegistered(emailAddress) {
    const results = await executeQuery("SELECT COUNT(*) AS count FROM userprofile WHERE emailAddress = ?", [emailAddress]);

    return results[0].count > 0;
  }


  export async function POST(request) {
    try {
      const { formData } = await request.json();
  
      let { firstName, lastName, emailAddress, password } = formData;
  
      const emailAlreadyRegistered = await checkIfEmailAlreadyRegistered(emailAddress);
  
      if (emailAlreadyRegistered) {
        logger.info(`[${emailAddress}] - [/api/signup] - User with email ${emailAddress} already exists`);
        return NextResponse.json({ error: "EMAIL_EXISTS" }, { status: 403 });
      }
  
      try {
        password = await passwordUtils.hashPassword(password);
  
        // Generate a random verification code
        const verificationCode = generateNumericCode();
        const isEmailVerified = false;
        const isProfileVerified = false;
        const documentType = false;
  
        const user = {
          firstName,
          lastName,
          emailAddress,
          password,
          verificationCode,
          isEmailVerified,
          isProfileVerified,
          documentType
        };
  
        const results = await executeQuery("INSERT INTO userprofile SET ?", user);
  
        if (results.affectedRows > 0) {
          logger.info(`[${emailAddress}] - [/api/signup] - User created successfully`);
          return NextResponse.json({ message: "Signup successful" }, { status: 200 });
        } else {
          throw new Error('Failed to insert user');
        }
  
      } catch (error) {
        logger.error(`[${emailAddress}] - [/api/signup] - Error in /signup: ${error.message}`);
        return NextResponse.json({ message: "Failed to signup", error: error.message }, { status: 500 });
      }
    } catch (error) {
      logger.error(`Error in /signup: ${error.message}`);
      return NextResponse.json({ message: "Failed to signup", error: error.message }, { status: 500 });
    }
  }
