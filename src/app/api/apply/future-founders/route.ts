import { FUTURE_FOUNDERS_FORM_URL } from "@/lib/alfia";

type Payload = { custom_fields?: Record<string, unknown> } & Record<string, unknown>;

async function submit(payload: Payload) {
  const upstream = await fetch(FUTURE_FOUNDERS_FORM_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const text = await upstream.text();
  let data: { errors?: Record<string, string[]> } & Record<string, unknown>;
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text.slice(0, 500) };
  }
  return { status: upstream.status, data };
}

// Alfia currently validates select options by splitting its option list on commas, so an option
// like "Yes, I have a team | …" is rejected and only "Yes" is accepted. When that exact rejection
// happens, retry once with the part before the comma; once Alfia fixes this, the first try passes.
function truncateRejectedCommaOptions(payload: Payload, errors: Record<string, string[]>): Payload | null {
  const custom = { ...(payload.custom_fields ?? {}) };
  let changed = false;
  for (const [key, messages] of Object.entries(errors)) {
    if (!key.startsWith("custom_fields.") || !messages.some((m) => m.includes("invalid"))) continue;
    const name = key.slice("custom_fields.".length);
    const value = custom[name];
    const cut = (v: unknown) => (typeof v === "string" && v.includes(",") ? v.split(",")[0].trim() : v);
    const next = Array.isArray(value) ? value.map(cut) : cut(value);
    if (JSON.stringify(next) !== JSON.stringify(value)) {
      custom[name] = next;
      changed = true;
    }
  }
  return changed ? { ...payload, custom_fields: custom } : null;
}

// Alfia's API doesn't send CORS headers, so the browser submits here and we forward it server-side.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid JSON body." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ message: "Invalid application payload." }, { status: 400 });
  }

  try {
    let result = await submit(body as Payload);
    if (result.status === 422 && result.data.errors) {
      const retry = truncateRejectedCommaOptions(body as Payload, result.data.errors);
      if (retry) result = await submit(retry);
    }
    return Response.json(result.data, { status: result.status });
  } catch {
    return Response.json({ message: "Could not reach the application service." }, { status: 502 });
  }
}
