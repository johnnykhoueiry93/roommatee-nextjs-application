// /api/getSupportTicketDetails

import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../utils/database"; // Adjust the path as needed
const logger = require("../../../utils/logger");

// Define the route function
export async function POST(request) {

  const { userId, openedSupportTicket, emailAddress } = await request.json();


  try {

    // Parse JSON body from the request
    logger.info(`[${emailAddress}] - [/api/getSupportTicketDetails] - Received request to get all support tickets for ${emailAddress}`);

    // Execute the database query to fetch user listings
    let results = await executeQuery(`SELECT st.*, sm.*
                                      FROM supportTicket st
                                      JOIN supportMessages sm ON st.caseId = sm.caseId
                                      WHERE st.userProfileId = ? AND st.caseId = ?`, [userId, openedSupportTicket]);

    if(results && results.length > 0) {
      logger.info(`[${emailAddress}] - [/api/getSupportTicketDetails] - Support tickets details results returned: ${results.length}`);
      return NextResponse.json({ data: results }, { status: 200 });
    } else {
      logger.info(`[${emailAddress}] - [/api/getSupportTicketDetails] - Support tickets details results returned: ${results.length}`);
      return NextResponse.json({ data: results }, { status: 200 });
    }

  } catch (error) {
    logger.error( `[${emailAddress}] - [/api/getSupportTicketDetails] - Failed to get the support tickets details for this user profile id: ${userId} and ticket id: ${openedSupportTicket}. Root Cause: ` + error.message );
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ message: "OK" });
}
