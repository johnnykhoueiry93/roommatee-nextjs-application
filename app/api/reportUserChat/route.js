// /api/setMysqlDatabaseFlagTrue

import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../utils/database"; // Adjust the import path based on your project structure
const logger = require("../../../utils/logger");

  export async function POST(request) {
    const { reportData } = await request.json();
    const {emailAddress, reportReason, description, reporter, reportee, conversationId} = reportData

    const newChatReport = {
      reportReason,
      description,
      reporter,
      reportee,
      conversationId,
    };

      try {
        const results = await executeQuery(`INSERT INTO userChatReport SET ?`, newChatReport);
  
        if (results.affectedRows > 0) {
          logger.info(`[${emailAddress}] - [/api/reportUserChat] - Successfully reported the user chat with conversation id: ${conversationId}.`)
          return NextResponse.json({ message: "Column updated successful" }, { status: 200 });
        } else {
          logger.error(`[${emailAddress}] - [/reportUserChat] - Error reporting the user chat with conversation id: ${conversationId}.`)
        }
  
      } catch (error) {
        logger.error(`[${emailAddress}] - [/api/reportUserChat] - Error reporting the user chat with conversation id: ${conversationId}. Root Cause: ` + error.message)
        return NextResponse.json({ message: "Column updat failed", error: error.message }, { status: 500 });
      }
  }
