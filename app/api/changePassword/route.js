// /api/changePassword

import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../utils/database"; // Adjust the import path based on your project structure
const logger = require("../../../utils/logger");
const passwordUtils = require("../../../utils/passwordUtils");
const WS='/api/changePassword';

export async function POST(request) {
  try {
    const profileStatus = 'ACTIVE';

    const { emailAddressToReset, password } = await request.json();

    logger.info(`[${emailAddressToReset}] - [${WS}] - User attempting to login with email: ${emailAddressToReset}`);

    const encryptedNewTempPassword = await passwordUtils.hashPassword(password);
    logger.info(`[${emailAddressToReset}] - [${WS}] - Setting a new encryptedNewTempPassword : >${encryptedNewTempPassword}<`);

    // Execute the query with parameters
    const results = await executeQuery("UPDATE userprofile SET password = ?, profileStatus = ? WHERE emailAddress = ?", [encryptedNewTempPassword, profileStatus, emailAddressToReset]);

    if(results.affectedRows > 0 ) {
        logger.info(`[${emailAddressToReset}] - [${WS}] - Password updated successfully in the database`);
        return NextResponse.json({ message: "Password updated successfully." }, { status: 200 });
    } else {
        logger.error(`[${emailAddressToReset}] - [${WS}] - Error updating password in the database!`);
        return NextResponse.json({ message: `Error updating password in the database` }, { status: 401 });
    }

  } catch (err) {
    logger.error(`[${emailAddressToReset}] - [${WS}] - Backend failure occured. Root Cause: `, err);
    return NextResponse.json({ message: "Internal server error", error: err.message }, { status: 500 });
  }
}
