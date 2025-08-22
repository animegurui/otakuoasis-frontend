// Frontend will read the backend base URL from Render env var
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== "undefined" ? `${window.location.origin}/api` : "");

// Helpers
export async function searchAnime(q) {
  const r = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}`);
  if (!r.ok) throw new Error("Search failed");
  return r.json();
}

export async function getInfo(id) {
  const r = await fetch(`${API_BASE}/info/${encodeURIComponent(id)}`);
  if (!r.ok) throw new Error("Info failed");
  return r.json();
}

export async function getWatch(episodeId) {
  const r = await fetch(`${API_BASE}/watch/${encodeURIComponent(episodeId)}`);
  if (!r.ok) throw new Error("Watch failed");
  return r.json();
}
