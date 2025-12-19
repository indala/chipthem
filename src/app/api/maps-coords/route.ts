// app/api/maps-coords/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getLatLngFromGoogleMapsUrl } from '@/hooks/getLatLngFromGoogleMapsUrl';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    const coords = await getLatLngFromGoogleMapsUrl(url);
    

    return NextResponse.json({
      lat: coords.lat,
      lng: coords.lng,
      success: true
    });

  } catch (error: unknown) {
  const message =
    error instanceof Error && error.message
      ? error.message
      : 'Failed to extract coordinates';

  return NextResponse.json(
    { error: message },
    { status: 400 }
  );
}
}
