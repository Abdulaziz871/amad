import { forwardToAlfia } from "@/lib/alfia";

// The embedded Alfia page for Future Founders posts here; the body goes to Alfia unchanged.
export async function POST(request: Request) {
  return forwardToAlfia("futureFounders", request);
}
