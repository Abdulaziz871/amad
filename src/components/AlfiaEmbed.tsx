"use client";

import { useEffect, useRef, useState } from "react";

// Shows an Alfia landing page exactly as Alfia designed it. The page reports its height
// (see getAmadIpEmbedHtml) so the frame grows and shrinks with each step instead of scrolling.
export function AlfiaEmbed({ html, title }: { html: string; title: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1100);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.source !== frameRef.current?.contentWindow) return;
      const data = e.data as { type?: string; height?: number };
      if (data?.type === "alfia-embed-height" && typeof data.height === "number" && data.height > 200) {
        setHeight(data.height);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      ref={frameRef}
      title={title}
      srcDoc={html}
      // Same-origin is needed so the page can post to our proxy route.
      sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
      className="block w-full overflow-hidden rounded-2xl border-0"
      style={{ height }}
      scrolling="no"
    />
  );
}
