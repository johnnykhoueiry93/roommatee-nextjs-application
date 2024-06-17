// /api/searchListingById

import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../utils/database"; // Adjust the import path based on your project structure
const logger = require("../../../utils/logger");

export async function POST(request) {
  let emailAddress = 'Visitor';
  const { requestedData } = await request.json();
  console.log('requestedData' , requestedData);
  const { listingId, userInfo } = requestedData;
  if(userInfo) {
      emailAddress = userInfo.emailAddress;
  } 

  try {
    

    logger.info(`[${emailAddress}] - [/api/searchListingById] - Searching listing by id: ${listingId}`);

    let query=`SELECT *, u.id AS userId, r.id AS listingId FROM roomListings r JOIN userprofile u ON r.userProfileId = u.id WHERE r.id = ${listingId}`;

    // Execute the query with parameters
    const results = await executeQuery(query);

    if(results.length > 0 ) {
        logger.info(`[${emailAddress}] - [/api/searchListingById] - Returned listing details for listing id: ${listingId}`);
        console.log(results)
        return NextResponse.json(results , { status: 200 });
    } else {
        logger.error(`[${emailAddress}] - [/api/searchListingById] - Failed to return listing details for listing id: ${listingId}`);
        return NextResponse.json({ message: `Oops! The listing might have been deleted by the owner` }, { status: 401 });
    }

  } catch (err) {
    logger.error(`[${emailAddress}] - [/api/searchListingById] - Failed to return listing details for listing id: ${listingId}. Root Cause: ` , err);
    return NextResponse.json({ message: "Internal server error", error: err.message }, { status: 500 });
  }
}
