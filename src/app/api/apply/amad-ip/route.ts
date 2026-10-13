import { forwardToAlfia } from "@/lib/alfia";

// The embedded Alfia page for Amad IP posts here; the body goes to Alfia unchanged.
export async function POST(request: Request) {
  return forwardToAlfia("amadIp", request);
}
