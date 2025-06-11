import { env } from '@/env.mjs';
import crypto from 'crypto';

export const CLOUDINARY_UPLOAD_PRESET = 'photoshare';
export const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export const getUploadUrl = (folder: string) =>
  `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

export async function listProjectImages(slug: string) {
  console.log('📡 Client: Calling API with slug:', slug);
  
  const res = await fetch('/api/list-images', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug }),
  });

  console.log('📡 Client: Response status:', res.status, res.statusText);

  if (!res.ok) {
    console.error('❌ Client: Cloudinary fetch failed');
    const errorText = await res.text();
    console.error('❌ Client: Error response:', errorText);
    return [];
  }

  const data = await res.json();
  console.log('📷 Client: Received data:', {
    type: typeof data,
    isArray: Array.isArray(data),
    length: data?.length || 0,
    sampleItem: data?.[0] || null
  });

  return data;
}
