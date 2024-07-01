// /api/getUserListings

import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../utils/database"; // Adjust the path as needed
const logger = require("../../../utils/logger");

// Define the route function
export async function POST(request) {
  const { userProfileId, emailAddress } = await request.json();

  try {
    // Execute the database query to fetch user listings
    const results = await executeQuery(
      `SELECT * FROM roomListings WHERE userProfileId = ?`,
      [userProfileId]
    );

    logger.info(`[${emailAddress}] - [/api/getUserListings] - Room listings results returned: ${results.length}`);
    return NextResponse.json(results);
  } catch (error) {
    logger.error(`[${emailAddress}] - [/api/getUserListings] - Error fetching user listings:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ message: "OK" });
}
