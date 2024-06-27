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

      try {
        const  { subject, caseArea, description, userProfileId, emailAddress } = ticketData;

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

            // TODO send email when a ticket was successfully created
            // use the caseID as reference caseId
            emailModule.sendNewSupportTicketCreated(emailAddress, firstName, caseId);
            return NextResponse.json({ message: "Ticket created successfully" }, { status: 200 });
          } 

        } else {
          logger.error(`[${emailAddress}] - [/api/createTicket] - Error creating the case. Root Cause: ` + + err.message);
          return NextResponse.json({ message: "Column updat failed", error: error.message }, { status: 500 });
        }
  
      } catch (error) {
        logger.error(`[${emailAddress}] - [/api/createTicket] - Error creating the case. Root Cause: ` + + err.message);
        return NextResponse.json({ message: "Column updat failed", error: error.message }, { status: 500 });
      }
  }
