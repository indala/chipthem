// Follow redirects to get the full Google Maps URL
async function resolveFinalUrl(url: string): Promise<string> {
  const res = await fetch(url, { redirect: "follow" });
  return res.url;
}

/**
 * Extract latitude & longitude from a Google Maps URL
 */
function extractLatLngFromMapsUrl(
  url: string
): { lat: number; lng: number } | null {

  // 1️⃣ Highest precision: internal markers (!3d latitude, !4d longitude)
  const preciseMatch = url.match(/!3d(-?\d+(\.\d+)?)!4d(-?\d+(\.\d+)?)/);
  if (preciseMatch) {
    return {
      lat: Number(preciseMatch[1]),
      lng: Number(preciseMatch[3]),
    };
  }

  // 2️⃣ Fallback: map view center (@lat,lng)
  const viewMatch = url.match(/@(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)/);
  if (viewMatch) {
    return {
      lat: Number(viewMatch[1]),
      lng: Number(viewMatch[3]),
    };
  }

  return null;
}

/**
 * Main exported function
 */
export async function getLatLngFromGoogleMapsUrl(
  mapsUrl: string
): Promise<{ lat: number; lng: number }> {

  const finalUrl = await resolveFinalUrl(mapsUrl);

  const coords = extractLatLngFromMapsUrl(finalUrl);
  if (!coords) {
    throw new Error("Latitude & longitude not found in Google Maps URL");
  }

  return coords;
}
