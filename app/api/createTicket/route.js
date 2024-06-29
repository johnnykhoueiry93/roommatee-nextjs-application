// /api/createTicket

import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../utils/database"; // Adjust the import path based on your project structure
const logger = require("../../../utils/logger");
const emailModule = require('../../../utils/emailUtils')

async function insertMessage(ticketMessage) {
  const results = await executeQuery(`INSERT INTO supportMessages SET ?`, ticketMessage);

  if (results.affectedRows > 0) {
    return true;
  } else {
    return false;
  }
}

  export async function POST(request) {
    let { ticketData } = await request.json();

    const  { subject, caseArea, description, userProfileId, emailAddress, firstName } = ticketData;

      try {

        const sqlInsert = {
          subject,
          caseArea,
          description,
          userProfileId
        };

        const results = await executeQuery(`INSERT INTO supportTicket SET ?`, sqlInsert);
  
        if (results.affectedRows > 0) {

          const caseId = results.insertId;
          const message = description;
          logger.info(`Ticket ID: ${caseId} submitted successfully`)

          const ticketMessage = {
            caseId,
            message,
            emailAddress
          };

          const isMessageSuccess = insertMessage(ticketMessage);

          if(isMessageSuccess) {
            logger.info(`[${emailAddress}] - [/api/createTicket] - A new support ticket with ID: ${caseId} was submited successfully.`)

            try {
              emailModule.sendNewSupportTicketCreated(emailAddress, firstName, caseId);
              return NextResponse.json({ message: "Ticket created successfully" }, { status: 200 });
            } catch (error) {
              logger.error(`[${emailAddress}] - [/api/createTicket] - Failed to send support case notification to the user.`);
              return NextResponse.json({ message: "Failed to send support case notification to the user.", error: error.message }, { status: 500 });
            }
          } 

        } else {
          logger.error(`[${emailAddress}] - [/api/createTicket] - Failed to create support case.`);
          return NextResponse.json({ message: "Failed to create support case"}, { status: 500 });
        }
  
      } catch (error) {
        logger.error(`[${emailAddress}] - [/api/createTicket] - Failed to create support case. Root Cause: ` + + error.message);
        return NextResponse.json({ message: "Failed to create support case", error: error.message }, { status: 500 });
      }
  }
