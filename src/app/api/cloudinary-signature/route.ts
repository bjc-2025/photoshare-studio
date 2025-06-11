import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  const { public_id, timestamp } = await req.json();

  console.log('🔐 Generating Signature');
  console.log('👉 public_id:', public_id);
  console.log('👉 timestamp:', timestamp);

  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

  // Create parameters object with all the parameters that will be sent to Cloudinary
  const params = {
    public_id: public_id,
    timestamp: timestamp
  };

  // Sort parameters alphabetically and create the string to sign
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key as keyof typeof params]}`)
    .join('&');

  // Append API secret to the parameters string
  const stringToSign = sortedParams + apiSecret;
  
  // Use SHA1 hash, not HMAC
  const signature = crypto
    .createHash('sha1')
    .update(stringToSign)
    .digest('hex');

  console.log('👉 sortedParams:', sortedParams);
  console.log('👉 stringToSign (with secret):', stringToSign);
  console.log('✅ signature:', signature);

  return NextResponse.json({
    signature,
    public_id,
    timestamp,
    api_key: apiKey,
    cloud_name: cloudName,
  });
}