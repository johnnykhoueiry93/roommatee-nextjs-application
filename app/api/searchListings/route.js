// /api/searchListings

import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../utils/database"; // Adjust the path as needed
const logger = require("../../../utils/logger");

// Define the route function
export async function POST(request) {
  try {
    // Parse JSON body from the request
    const requestedData = await request.json();

    console.log('requestedData: ' , requestedData);

    const { searchValue, minPriceFilter, maxPriceFilter, moveInDate, userInfo, tenantFilters, profileType, profileLimit} = requestedData;

    let emailAddress = 'Visitor';
    if(userInfo) {
        emailAddress = userInfo.emailAddress;
    } 

    // Check if booleanFilter is defined, otherwise use an empty object
    const booleanFilter = requestedData.booleanFilter || {};

    // Destructure booleanFilter from req.body
    const {
        privateBathroom,
        privateParking,
        publicParking,
        wheelChairAccessibility,
        internetConnection,
        washer,
        dryer,
        dishWasher,
        petFriendly,
        refrigerator,
        smokingAllowed,
        furnished,
        television,
        airConditionning,
        heating,
        fireplace,
        smokeAlarm,
        dishes,
        toaster,
        coffeeMaker,
      } = booleanFilter;

      // Add boolean filters dynamically
      const booleanFilters = [
        privateBathroom,
        privateParking,
        publicParking,
        wheelChairAccessibility,
        internetConnection,
        washer,
        dryer,
        dishWasher,
        petFriendly,
        refrigerator,
        smokingAllowed,
        furnished,
        television,
        airConditionning,
        heating,
        fireplace,
        smokeAlarm,
        dishes,
        toaster,
        coffeeMaker,
      ];


    const { rawAddressValue, locationResolved, zip, city, state, country, address, street } = searchValue;

    logger.info(`[${emailAddress}] - [/api/searchListings] - Backend received input from frontend value: >${rawAddressValue}<, Max Price: ${maxPriceFilter}, Min Price: ${minPriceFilter}, Move In Date: ${moveInDate}, Filters: ${booleanFilters}`);


    let conditions = [];

    // if the user typed something that google map couldnt resolve
    // we will attempt to search the city / state / zip for a match
    // Build an array to store conditions for the WHERE clause
    if(locationResolved === 0) {
    conditions = [
        `(r.address LIKE '%${rawAddressValue}%'
            OR r.city LIKE '%${rawAddressValue}%'
            OR r.state LIKE '%${rawAddressValue}%'
            OR r.zip LIKE '%${rawAddressValue}%')`,
    ]; 
    
    } else {
        if(zip && city && state && country) {
            conditions.push(`r.zip LIKE '%${zip}%'`);
            conditions.push(`r.city LIKE '%${city}%'`);
            conditions.push(`r.state LIKE '%${state}%'`);
            conditions.push(`r.country LIKE '%${country}%'`);
        } else if (country && city && state) {
            conditions.push(`r.city LIKE '%${city}%'`);
            conditions.push(`r.state LIKE '%${state}%'`);
            conditions.push(`r.country LIKE '%${country}%'`);
        } else if(city &&  country) {
            conditions.push(`r.country LIKE '%${country}%'`);
            conditions.push(`r.city LIKE '%${city}%'`);
        } else if (state && country) {
            conditions.push(`r.state LIKE '%${state}%'`);
            conditions.push(`r.country LIKE '%${country}%'`);
        } else if (country) {
            conditions.push(`r.country LIKE '%${country}%'`);
        }
    }


    // Append a max price filter if set by the user
    if (maxPriceFilter) {
        conditions.push(`r.price <= ${maxPriceFilter}`);
    }

    // Append a min price filter if set by the user
    if (minPriceFilter) {
        conditions.push(`r.price >= ${minPriceFilter}`);
    }

    if (moveInDate) {
        // Assuming moveInDate is in ISO format, e.g., '2024-01-09'
        const formattedMoveInDate = new Date(moveInDate);

        // Adjust moveInDateFilter by +/- 2 days
        const startDate = new Date(formattedMoveInDate);
        startDate.setDate(startDate.getDate() - 2);

        const endDate = new Date(formattedMoveInDate);
        endDate.setDate(endDate.getDate() + 2);

        // Use BETWEEN for date range comparison
        conditions.push(
        `r.moveInDate BETWEEN '${startDate
            .toISOString()
            .slice(0, 10)}' AND '${endDate.toISOString().slice(0, 10)}'`
        );
    }

    const booleanFilterNames = [
        "privateBathroom",
        "privateParking",
        "publicParking",
        "wheelChairAccessibility",
        "internetConnection",
        "washer",
        "dryer",
        "dishWasher",
        "petFriendly",
        "refrigerator",
        "smokingAllowed",
        "furnished",
        "television",
        "airConditionning",
        "heating",
        "fireplace",
        "smokeAlarm",
        "dishes",
        "toaster",
        "coffeeMaker",
      ];

      booleanFilters.forEach((filter, index) => {
        if (filter) {
          conditions.push(`${booleanFilterNames[index]} = ${filter}`);
        }
      });

      // Join the conditions with "AND" to form the WHERE clause
      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";


      const query = `SELECT *, u.id AS userId, r.id AS listingId FROM roomListings r
      JOIN userprofile u ON r.userProfileId = u.id
      ${whereClause} 
      ${profileLimit ? `LIMIT ${profileLimit}` : ''};`;

      logger.info(`[${emailAddress}] - [/api/searchListings] - Printing the full query: ${query}`);

    // Execute the database query to fetch user listings
    const results = await executeQuery(query);

    logger.info(`[${emailAddress}] - [/api/searchListings] - Room listings results returned: ${results.length}`);
    return NextResponse.json(results);
  } catch (error) {
    logger.error(`[${emailAddress}] - [/api/searchListings] - Error fetching search listings: `, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ message: "OK" });
}
