import AWS from 'aws-sdk';
import { NextResponse } from 'next/server';

const S3_UPLOAD_BUCKET_NAME = process.env.S3_UPLOAD_BUCKET_NAME;

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2',
});

const s3 = new AWS.S3();

export async function POST(request) {
  console.log('We reached S3');
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  const folder = searchParams.get('folder');

  if (!key) {
    return NextResponse.json({ error: 'Key parameter is missing' }, { status: 400 });
  }

  // Construct S3 parameters
  let s3Key = folder ? `${folder}/${key}` : key;

  const params = {
    Bucket: S3_UPLOAD_BUCKET_NAME,
    Key: s3Key,
    Expires: 3600,
  };

  try {
    const url = s3.getSignedUrl('getObject', params);
    return NextResponse.json({ s3Url: url });
  } catch (error) {
    console.error('Error generating S3 signed URL:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}