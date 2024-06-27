// /api/api/sendTicketReply

import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../utils/database"; // Adjust the import path based on your project structure
const logger = require("../../../utils/logger");

  export async function POST(request) {
    let { messageReply } = await request.json();
    const {caseId, message,emailAddress } = messageReply;

    const ticketReply = {
      caseId,
      message,
      emailAddress
    };

      try {
        const results = await executeQuery(`INSERT INTO supportMessages SET ?`, ticketReply);
  
        if (results.affectedRows > 0) {
          logger.info(`[${emailAddress}] - [/api/sendTicketReply] - Reply to case ID: ${caseId} submitted successfully. Reply: ${message}`)
          return NextResponse.json({ message: "Column updated successful" }, { status: 200 });
        } else {
          logger.error(`[${emailAddress}] - [/api/sendTicketReply] - Error sending reply to case ID: ${caseId}. Reply: ${message}. Root Cause: ` + + err.message);
          return NextResponse.json({ message: "Column updat failed", error: error.message }, { status: 500 });
        }
  
      } catch (error) {
        logger.info(`[${emailAddress}] - [/api/sendTicketReply] - Reply to case ID: ${caseId} submitted successfully. Reply: ${message}`)
        return NextResponse.json({ message: "Column updat failed", error: error.message }, { status: 500 });
      }
  }
