import { AMAD_IP_FORM_URL } from "@/lib/alfia";

// The embedded Alfia page for Amad IP posts here (Alfia's API doesn't send CORS headers for our
// domain). The body is forwarded unchanged: JSON normally, multipart when files are attached.
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type");
  if (!contentType || !/^(application\/json|multipart\/form-data)/.test(contentType)) {
    return Response.json({ message: "Unsupported content type." }, { status: 415 });
  }

  try {
    const upstream = await fetch(AMAD_IP_FORM_URL, {
      method: "POST",
      headers: { "Content-Type": contentType, Accept: "application/json" },
      body: await request.arrayBuffer(),
      cache: "no-store",
    });
    return new Response(await upstream.text(), {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return Response.json({ message: "Could not reach the application service." }, { status: 502 });
  }
}
