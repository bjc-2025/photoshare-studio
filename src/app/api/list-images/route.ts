import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { slug } = await req.json();
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;

  console.log('🔍 API: Searching for images with slug:', slug);
  console.log('🔍 API: Cloud name:', cloudName);

  // Try different search expressions
  const expressions = [
    `public_id starts_with "photoshare/${slug}/" AND resource_type="image"`,
    `public_id:"photoshare/${slug}/*"`,
    `folder:"photoshare/${slug}"`,
    `public_id starts_with "photoshare/${slug}"`,
    `public_id:"photoshare/*"`, // This will find ANY image with photoshare
    `resource_type:"image"` // This will find ALL images (last resort)
  ];

  let foundResources = [];
  
  for (let i = 0; i < expressions.length; i++) {
    const expression = expressions[i];
    console.log(`🔍 API: Trying expression ${i + 1}:`, expression);

    const requestBody = {
      expression,
      sort_by: [{ created_at: 'desc' }],
      max_results: 30,
    };

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/search`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await res.json();
    console.log(`📥 API: Expression ${i + 1} result:`, {
      status: res.status,
      total_count: data.total_count,
      resources_length: data.resources?.length || 0,
      sample_public_ids: data.resources?.slice(0, 3)?.map((r: any) => r.public_id) || []
    });

    if (data.resources && data.resources.length > 0) {
      // Filter results to only include images that match our slug
      const filteredResources = data.resources.filter((resource: any) => 
        resource.public_id.includes(`photoshare/${slug}`)
      );
      
      if (filteredResources.length > 0) {
        console.log(`✅ API: Found ${filteredResources.length} matching images with expression ${i + 1}`);
        foundResources = filteredResources;
        break;
      }
    }
  }

  console.log(`📷 API: Final result - returning ${foundResources.length} images`);
  if (foundResources.length > 0) {
    console.log('📷 API: Sample public_ids:', foundResources.slice(0, 3).map((r: any) => r.public_id));
  }

  return NextResponse.json(foundResources);
}