// /api/resetPassword

import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../utils/database"; // Adjust the import path based on your project structure
import { cookies } from "next/headers";
const logger = require("../../../utils/logger");
const passwordUtils = require("../../../utils/passwordUtils");
const emailModule = require('../../../utils/emailUtils')

function generateTempPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_+=";
    let password = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }
  
    return password;
  }

export async function POST(request) {
  try {
    const { emailAddressToReset } = await request.json();

    logger.info(`[${emailAddressToReset}] - User attempting to reset email: ${emailAddressToReset}`);

    // Execute the query with parameters
    const results = await executeQuery("SELECT * FROM userprofile WHERE emailAddress = ?", [emailAddressToReset]);

    if(results.length > 0 ) {
        logger.info(`[${emailAddressToReset}] - [/resetPassword] - The email address: ${emailAddressToReset} requested to reset was found.`);
        const user = results[0];
        const { firstName, lastName } = user;
        const profileStatus = "PASSWORD RESET";

        const newTempPassword = generateTempPassword(8);
        logger.info(`[${emailAddressToReset}] - [/resetPassword] - newTempPassword : >` + newTempPassword +'<')

        emailModule.sendEmailResetPassword(emailAddressToReset, newTempPassword, firstName, lastName);
        const encryptedNewTempPassword = await passwordUtils.hashPassword(newTempPassword);
        logger.info(`[${emailAddressToReset}] - [/resetPassword] - encryptedNewTempPassword : >` + encryptedNewTempPassword +'<')

        const resetPasswordResults = await executeQuery("UPDATE userprofile SET password = ?, profileStatus = ? WHERE emailAddress = ?", [newPassword, profileStatus, emailAddressToReset]);
        if(resetPasswordResults.affectedRows > 0) {
            logger.info(`[${emailAddressToReset}] - [/resetPassword] - Password updated successfully in the database`);
            return NextResponse.json({ message: "Email found." }, { status: 200 });
        } else {
            logger.error(`[${emailAddressToReset}] - [/resetPassword] - Error updating password in the database:`);
        }
        
    
    } else {
        logger.info(`[${emailAddressToReset}] - [/resetPassword] - The requested email address does not exist in the database. System will do nothing.`);
        return NextResponse.json({ message: 'This email does not exist' }, { status: 401 });
    }

  } catch (err) {
    logger.error(`Backend failure during the /api/resetPassword webservice`, err);
    return NextResponse.json({ message: "Internal server error", error: err.message }, { status: 500 });
  }
}
