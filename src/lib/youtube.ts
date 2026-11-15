// Accepts a full YouTube link (watch, youtu.be, shorts, embed) or a plain 11-character ID.
export function extractYouTubeId(input: string): string | null {
  const s = input.trim();
  const valid = /^[A-Za-z0-9_-]{11}$/;
  if (valid.test(s)) return s;
  try {
    const url = new URL(s.startsWith("http") ? s : `https://${s}`);
    const host = url.hostname.replace(/^www\.|^m\./, "");
    let id: string | null = null;
    if (host === "youtu.be") {
      id = url.pathname.split("/")[1] ?? null;
    } else if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      if (url.pathname === "/watch") id = url.searchParams.get("v");
      else {
        const m = url.pathname.match(/^\/(embed|shorts|live|v)\/([^/?]+)/);
        id = m ? m[2] : null;
      }
    }
    return id && valid.test(id) ? id : null;
  } catch {
    return null;
  }
}