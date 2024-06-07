// /api/changePassword

import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../utils/database"; // Adjust the import path based on your project structure
import { cookies } from "next/headers";
const logger = require("../../../utils/logger");
const passwordUtils = require("../../../utils/passwordUtils");

export async function POST(request) {
  try {
    const profileStatus = 'ACTIVE';

    const { emailAddressToReset, password } = await request.json();

    logger.info(`[${emailAddressToReset}] - User attempting to login with email: ${emailAddressToReset}`);

    const encryptedNewTempPassword = await passwordUtils.hashPassword(password);
    logger.info('encryptedNewTempPassword : >' + encryptedNewTempPassword +'<')

    // Execute the query with parameters
    const results = await executeQuery("UPDATE userprofile SET password = ?, profileStatus = ? WHERE emailAddress = ?", [encryptedNewTempPassword, profileStatus, emailAddressToReset]);

    if(results.affectedRows > 0 ) {
        logger.info('Password updated successfully in the database');
        return NextResponse.json({ message: "Password updated successfully." }, { status: 200 });
    } else {
        logger.error(`Error updating password in the database:! ${updateErr}`);
        return NextResponse.json({ message: `Error updating password in the database:! ${updateErr}` }, { status: 401 });
    }

  } catch (err) {
    logger.error(`Backend failure during the /api/changePassword webservice`, err);
    return NextResponse.json({ message: "Internal server error", error: err.message }, { status: 500 });
  }
}
