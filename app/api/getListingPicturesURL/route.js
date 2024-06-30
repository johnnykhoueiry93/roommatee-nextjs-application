// /api/getListingPicturesURL

/**
 * This route will return all the URLs of the listing
 * and will populate the Carousel
 */

import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../utils/database"; 
import AWS from 'aws-sdk';
const logger = require("../../../utils/logger");

export async function POST(request) {
  try {
    const { listingId, emailAddress } = await request.json();

    logger.info(`[${emailAddress}] - [/api/getListingPicturesURL] - Getting the listing picture URLs for listingId: ${listingId}`);

    // Execute the query with parameters
    const results = await executeQuery(
      "SELECT pictures FROM roomListings JOIN userprofile ON roomListings.userProfileId = userprofile.id WHERE roomListings.id = ?",
      [listingId]
    );

    if (results.length > 0 && results[0].pictures) {
      const pictures = results[0].pictures.split(','); // Split the pictures string into an array
      console.log("pictures: " , pictures);
      return NextResponse.json({ message: "Results found", pictures: pictures }, { status: 200 });
    } else {
      return NextResponse.json({ message: "No results found" });
    }

  } catch (err) {
    logger.error(`Backend failure during the /api/getListingPicturesURL webservice`, err);
    return NextResponse.json({ message: "Internal server error", error: err.message }, { status: 500 });
  }
}
