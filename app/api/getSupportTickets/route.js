// /api/getSupportTickets

import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../utils/database"; // Adjust the path as needed
const logger = require("../../../utils/logger");

// Define the route function
export async function POST(request) {

  try {
    const { userId, userType, emailAddress } = await request.json();

    // Parse JSON body from the request
    logger.info(`[${emailAddress}] - [/api/getSupportTickets] - Received request to get all support tickets for ${emailAddress}`);

    // Execute the database query to fetch user listings
    let results;
    if(userType == "admin") {
      results = await executeQuery(`SELECT * FROM supportTicket`);
    } else {
      results = await executeQuery(`SELECT * FROM supportTicket WHERE userProfileId = ?`, [userId]);
    }

    if(results && results.length > 0) {
      logger.info(`[${emailAddress}] - [/api/getSupportTickets] - Support tickets results returned: ${results.length}`);
      return NextResponse.json({ data: results }, { status: 200 });
    } else {
      logger.info(`[${emailAddress}] - [/api/getSupportTickets] - Support tickets results returned: ${results.length}`);
      return NextResponse.json({ data: results }, { status: 200 });
    }

  } catch (error) {
    logger.error( `[${emailAddress}] - [/api/getSupportTickets] - Failed to get the support tickets for this user profile id: ${userId} Root Cause: ` + error.message );
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ message: "OK" });
}
