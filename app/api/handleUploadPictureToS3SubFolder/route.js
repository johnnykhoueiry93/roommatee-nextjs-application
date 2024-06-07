// /api/handleUploadPictureToS3SubFolder

import { NextRequest, NextResponse } from "next/server";
import { uploadSinglePictureToS3 } from "../../../utils/awsUtils"; // Adjust the import path based on your project structure
const logger = require("../../../utils/logger");
import formidable from 'formidable';

export async function POST(request) {
    try {
      const { formData } = await request.json();
      const { userId, emailAddress } = formData;
      const { folder } = request.query;

      logger.info(`[${emailAddress}] - [/api/handleUploadPictureToS3SubFolder] - Received WS request with paramter: ${folder}`);

      // Check if the required parameters are present
      if (!userId || !req.file) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      // Parse the incoming request using formidable
    const form = new formidable.IncomingForm();

    // Set the upload directory for the files
    form.uploadDir = "./uploads"; // Adjust the upload directory as needed

    // Parse the request
    const fileToUploadPromise = new Promise((resolve, reject) => {
      form.parse(request, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(files.file.path); // Get the path of the uploaded file
      });
    });

    // Wait for the promise to resolve
    const fileToUpload = await fileToUploadPromise;

    const key = `${folder}/${userId}-${folder}.png`;


    logger.info('fileToUpload: ' + fileToUpload);
    logger.info('key: ' + key);

    
      //@ts-ignore
      uploadSinglePictureToS3(emailAddress, fileToUpload, key, (err, s3Location) => {
        if (err) {
            return NextResponse.json({ message: "Internal server error", error: err.message }, { status: 500 });
        } else {
          return NextResponse.json({ success: true, s3Location }, { status: 200 });
        }
      });
      
  
    } catch (err) {
      logger.error(`Backend failure during the /api/handleUploadPictureToS3SubFolder webservice`, err);
      return NextResponse.json({ message: "Internal server error", error: err.message }, { status: 500 });
    }
  }