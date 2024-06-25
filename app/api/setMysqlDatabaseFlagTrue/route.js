// /api/setMysqlDatabaseFlagTrue

import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../utils/database"; // Adjust the import path based on your project structure
const logger = require("../../../utils/logger");

  export async function POST(request) {
    const { requestedData } = await request.json();
    let { emailAddress, table, column, value } = requestedData;

      try {
        const results = await executeQuery(`UPDATE ${table} SET ${column} = ? WHERE emailAddress = ?`, [value, emailAddress]);
  
        if (results.affectedRows > 0) {
          logger.info(`[${emailAddress}] - [/api/setMysqlDatabaseFlagTrue] - Column: ${column} was updated to: ${value}`);
          return NextResponse.json({ message: "Column updated successful" }, { status: 200 });
        } else {
          throw new Error('Failed to insert user');
        }
  
      } catch (error) {
        logger.error(`[${emailAddress}] - [/api/setMysqlDatabaseFlagTrue] - Error while updating column: ${column} was updated to: ${value}: ${error.message}`);
        return NextResponse.json({ message: "Column updat failed", error: error.message }, { status: 500 });
      }
  }
