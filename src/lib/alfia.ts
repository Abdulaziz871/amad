// Public Alfia "venture application forms". The forms belong to Alfia: we show each one exactly as
// Alfia designed it by embedding its own landing page, and only route submissions through our server
// (Alfia's API doesn't send CORS headers for other domains). The tokens are public by design.
export const ALFIA_FORMS = {
  futureFounders: {
    url: "https://api.venture.alfia.com.sa/api/public/venture-application-forms/onF4riq6wgDq1tM7PeY6yC0mwlk1o0BKGLItN7NdbbhbrBdAZzC6ckWS8dcZRBMz",
    proxyPath: "/api/apply/future-founders",
  },
  amadIp: {
    url: "https://api.venture.alfia.com.sa/api/public/venture-application-forms/xBZelGorII0xZ5WM750tccxpdNPzFV6aszA7p9KEmGLRj5J3ZGtvSbzsZQOk1W7I",
    proxyPath: "/api/apply/amad-ip",
  },
} as const;

export type AlfiaFormKey = keyof typeof ALFIA_FORMS;

// Injected into the embedded page: reports its content height so the iframe fits each step. Alfia's
// pages stretch their wrapper to the viewport (min-height:100vh), so we measure the wrapper's
// children (header, card, footer) plus its bottom padding rather than the document height.
const EMBED_HEIGHT_SCRIPT = `<script>(function(){var last=0;function measure(){var max=0;Array.prototype.forEach.call(document.body.children,function(p){if(p.tagName==="SCRIPT")return;var pad=parseFloat(getComputedStyle(p).paddingBottom)||0;Array.prototype.forEach.call(p.children,function(c){if(c.tagName==="SCRIPT")return;max=Math.max(max,c.getBoundingClientRect().bottom+window.scrollY+pad);});});return Math.ceil(max||document.documentElement.scrollHeight);}function send(){var h=measure();if(Math.abs(h-last)>2){last=h;parent.postMessage({type:"alfia-embed-height",height:h},"*");}}var ro=new ResizeObserver(send);Array.prototype.forEach.call(document.body.children,function(p){Array.prototype.forEach.call(p.children,function(c){ro.observe(c);});});new MutationObserver(send).observe(document.body,{childList:true,subtree:true});window.addEventListener("load",send);send();})();</script>`;

/** Alfia's landing page for a form, unchanged except that it posts to our proxy and reports its height. */
export async function getAlfiaEmbedHtml(key: AlfiaFormKey): Promise<string | null> {
  const { url, proxyPath } = ALFIA_FORMS[key];
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      // Short cache so edits made in Alfia reach the site within a minute.
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const html: unknown = (await res.json())?.data?.form?.landing_page_html;
    if (typeof html !== "string" || !html.includes(url)) return null;
    const routed = html.split(url).join(proxyPath);
    return routed.includes("</body>") ? routed.replace("</body>", `${EMBED_HEIGHT_SCRIPT}</body>`) : routed + EMBED_HEIGHT_SCRIPT;
  } catch {
    return null;
  }
}

/** Forwards a submission from the embedded page to Alfia unchanged: JSON, or multipart when files are attached. */
export async function forwardToAlfia(key: AlfiaFormKey, request: Request): Promise<Response> {
  const contentType = request.headers.get("content-type");
  if (!contentType || !/^(application\/json|multipart\/form-data)/.test(contentType)) {
    return Response.json({ message: "Unsupported content type." }, { status: 415 });
  }
  try {
    const upstream = await fetch(ALFIA_FORMS[key].url, {
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
