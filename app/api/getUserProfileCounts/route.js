//  /api/getUserProfileCounts

import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../utils/database"; // Adjust the path as needed
const logger = require("../../../utils/logger");

// Define the route function
export async function POST(request) {
  const { emailAddress, column } = await request.json();

  try {
    const results = await executeQuery(`SELECT count(*) AS userCount FROM userprofile WHERE ${column} = 1`, column);
    if (results && results.length > 0) {
      const userCount = results[0].userCount;
      logger.info(`[ADMIN] - [/getUserProfileCounts] - Returning ${userCount} users for filter ${column}`);
      return NextResponse.json({ userCount }, { status: 200 });

    }

  } catch (error) {
    logger.error(`[${emailAddress}] - [ADMIN] - [/api/getUserProfileCounts] - Error fetching user counts for filter ${column}. Root Cause`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ message: "OK" });
}
