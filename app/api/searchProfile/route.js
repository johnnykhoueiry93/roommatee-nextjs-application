// /api/searchProfile

import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../utils/database"; // Adjust the path as needed
const logger = require("../../../utils/logger");

const buildFilterQuery = (filters, filterKey) => {
  let query = '';

  // Check if 'Any' is selected
  if (filters[filterKey].includes('Any')) {
    return ''; // Return empty string to skip the entire function
  }

  if (filters[filterKey].length > 0) {
    query += ` AND ${filterKey} IN (`;

    // Add each selected value to the query 
    //@ts-ignore
    filters[filterKey].forEach((value, index) => {
      if (index !== 0) {
        query += ', ';
      }
      // Add single quotes for string values
      query += typeof value === 'string' ? `'${value}'` : value;
    });

    query += ')';
  }

  return query;
};

// Define the route function
export async function POST(request) {
  try {
    // Parse JSON body from the request
    const requestedData = await request.json();

    // console.log('[DEBUG] requestedData: ' , requestedData);

    const { profileType, searchValue, userInfo, tenantFilters, profileLimit, homePageRequest } = requestedData;

    let emailAddress = 'Visitor';
    if(userInfo) {
        emailAddress = userInfo.emailAddress;
    } 

    const { rawAddressValue, locationResolved, zip, city, state, country, address, street } = searchValue;
    logger.info(`[${emailAddress}] - [/searchProfile] - Backend received profileType: ${profileType} and input from frontend: ${rawAddressValue}`);

    let profileBasedConfition;
    let query;
    
    if (profileType == 'tenant') {
      profileBasedConfition='userHasAPlace = 0';
      query = `SELECT * 
               FROM userprofile 
               WHERE emailAddress != '${emailAddress}' AND ${profileBasedConfition}`;

    } else if (profileType == 'roommate') {
      profileBasedConfition='u.isLookingForRoommate = 1';
      query = `SELECT *, u.id AS userId, r.id AS listingId 
                FROM roomListings r 
                RIGHT OUTER JOIN userprofile u ON r.userProfileId = u.id 
                WHERE u.emailAddress != '${emailAddress}' 
                AND ${profileBasedConfition}`
    }

    if(!homePageRequest) {
      if (state !== '') {
        query += ` AND citiesLookingToLiveIn like '%${city}, ${state}%'`;
      } else {
        query += ` AND citiesLookingToLiveIn like '%${rawAddressValue}%'`;
      }
    }


    // Modify the query based on the presence of tenantFilters
    if (tenantFilters) {
      // Here you can include conditions based on the tenantFilters
      if (tenantFilters.minBudgetFilter !== "") {
        query += ` AND budget >= ${tenantFilters.minBudgetFilter}`;
      }
      if (tenantFilters.maxBudgetFilter !== "") {
        query += ` AND budget <= ${tenantFilters.maxBudgetFilter}`;
      }
      if (tenantFilters.minAge !== "") {
        query += ` AND age >= ${tenantFilters.minAge}`;
      }
      if (tenantFilters.maxAge !== "") {
        query += ` AND age <= ${tenantFilters.maxAge}`;
      }
      if (tenantFilters.isSmoker !== false) {
        query += ` AND isSmoker = '1'`;
      }
      if (tenantFilters.isEmailVerified !== false) {
        query += ` AND isEmailVerified = '1'`;
      }
      if (tenantFilters.isProfileVerified !== false) {
        query += ` AND isProfileVerified = '1'`;
      }
      // Build query for socialStatus
      query += buildFilterQuery(tenantFilters, 'socialStatus');

      // Build query for cleanlinessLevel
      query += buildFilterQuery(tenantFilters, 'cleanlinessLevel');

      // Build query for gender
      query += buildFilterQuery(tenantFilters, 'gender');

      // Build query for hasPet
      query += buildFilterQuery(tenantFilters, 'hasPet');

      // Build query for hasPet
      query += buildFilterQuery(tenantFilters, 'typeOfPlace');
    }

  if(profileLimit) {
    query += `${profileLimit ? ` LIMIT ${profileLimit}` : ''}`;
  }

    logger.info(`[${emailAddress}] - [/api/searchProfile] - Printing the full query: ${query}`);

    // Execute the database query to fetch user listings
    const results = await executeQuery(query);

    logger.info(`[/api/searchProfile] - Room listings results returned: ${results.length}`);
    return NextResponse.json(results);
  } catch (error) {
    logger.error("[/api/searchProfile] - Error fetching search listings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ message: "OK" });
}
