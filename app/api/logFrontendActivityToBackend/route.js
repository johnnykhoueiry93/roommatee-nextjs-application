// /api/logFrontEndActivity

const logger = require("../../../utils/logger");
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
      const { emailAddress, message } = await request.json();
  
      logger.info(`[${emailAddress}] - [/api/logFrontEndActivity] - ${message}`);
      
      // Return a 200 response
      return new Response(null, { status: 200 });

    } catch (err) {
      logger.error(`Backend failure during the /api/logFrontEndActivity webservice`, err);
      return new Response(null, { status: 500 });
    }
}
