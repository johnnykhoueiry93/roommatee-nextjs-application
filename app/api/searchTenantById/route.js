// /api/searchTenantById

import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../utils/database"; // Adjust the import path based on your project structure
const logger = require("../../../utils/logger");

  export async function POST(request) {
      const { idToSearchFor, emailAddress, querytype } = await request.json();
  
      logger.info(`[${emailAddress}] - [/api/searchTenantById] - Received request to search tenant/roommate by id: ${idToSearchFor} directly with querytype: ${querytype}`);
  
      let query;
      
      try {
        if(querytype == 'tenant') {
          query = "SELECT * FROM userprofile WHERE  id = ?";
        } else {
          query=`SELECT *, u.id AS userId, r.id AS listingId
                FROM roomListings r 
                RIGHT OUTER JOIN userprofile u ON r.userProfileId = u.id 
                WHERE u.id = ?`
        }
  
        const results = await executeQuery(query, idToSearchFor);

        if (results.length > 0) {
          logger.info(`[${emailAddress}] - [/api/searchTenantById] - Tenant/Roommate by id: ${idToSearchFor} found`);
          return NextResponse.json({ message: "Search successful", results: results }, { status: 200 });
        } else {
          throw new Error('Query returned 0 results');
        }
  
      } catch (error) {
        logger.error(`[${emailAddress}] - [/api/searchTenantById] - Error while fetching Tenant/Roommate by id: ${error.message}`);
        return NextResponse.json({ message: "Failed to signup", error: error.message }, { status: 500 });
      }
   
  }
