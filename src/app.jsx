import React, { useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";
import { searchAnime, getInfo, getWatch } from "./api";

export default function App() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [videoSrc, setVideoSrc] = useState("");
  const videoRef = useRef(null);

  const apiBase = useMemo(
    () => import.meta.env.VITE_API_BASE_URL || "",
    []
  );

  useEffect(() => {
    if (!videoSrc) return;
    const video = videoRef.current;
    if (!video) return;

    // If HLS stream, use hls.js
    if (videoSrc.includes(".m3u8") && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      video.play().catch(() => {});
      return () => hls.destroy();
    } else {
      // MP4/direct
      video.src = videoSrc;
      video.play().catch(() => {});
    }
  }, [videoSrc]);

  async function onSearch() {
    setErr("");
    setLoading(true);
    setInfo(null);
    setResults([]);
    try {
      const data = await searchAnime(q);
      setResults(data.results || []);
    } catch (e) {
      setErr(e.message || "Search error");
    } finally {
      setLoading(false);
    }
  }

  async function openInfo(id) {
    setErr("");
    setLoading(true);
    setInfo(null);
    try {
      const data = await getInfo(id);
      setInfo(data);
      setVideoSrc("");
      window.scrollTo(0, 0);
    } catch (e) {
      setErr(e.message || "Info error");
    } finally {
      setLoading(false);
    }
  }

  async function playEpisode(epId) {
    setErr("");
    setLoading(true);
    try {
      const data = await getWatch(epId);
      // Prefer an HLS source if available; otherwise first source
      const hls = (data.sources || []).find(s => (s.quality || "").toLowerCase().includes("hls") || (s.url || "").includes(".m3u8"));
      const first = (data.sources || [])[0];
      const chosen = hls?.url || first?.url || "";
      if (!chosen) throw new Error("No playable source");
      setVideoSrc(chosen);
    } catch (e) {
      setErr(e.message || "Watch error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "system-ui", color: "#fff", background: "#0b0b14", minHeight: "100vh" }}>
      <header style={{ display: "flex", gap: 8, alignItems: "center", padding: 16, background: "#1f1f2e", position: "sticky", top: 0 }}>
        <h1 style={{ margin: 0 }}>OtakuOasis</h1>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search anime…"
          style={{ flex: 1, padding: 10, borderRadius: 8, border: "none" }}
        />
        <button onClick={onSearch} style={{ padding: "10px 14px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff" }}>
          Search
        </button>
        {apiBase ? <small style={{ opacity: 0.6 }}>API: {apiBase}</small> : null}
      </header>

      <main style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>
        {err ? <div style={{ background: "#7f1d1d", padding: 10, borderRadius: 8, marginBottom: 12 }}>{err}</div> : null}
        {loading ? <div>Loading…</div> : null}

        {videoSrc ? (
          <div style={{ marginBottom: 20 }}>
            <video
              ref={videoRef}
              controls
              autoPlay
              style={{ width: "100%", background: "#000", borderRadius: 12 }}
            />
          </div>
        ) : null}

        {info ? (
          <section style={{ marginBottom: 24 }}>
            <h2 style={{ marginBottom: 6 }}>{info.title}</h2>
            <p style={{ opacity: 0.9 }}>{info.description}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(info.episodes || []).map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => playEpisode(ep.id)}
                  style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #333", background: "#1c1c2a", color: "#fff" }}
                >
                  Episode {ep.number}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {!info && results?.length > 0 ? (
          <section>
            <h2>Results</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
              {results.map((a) => (
                <div key={a.id} style={{ border: "1px solid #333", borderRadius: 10, background: "#1c1c2a", padding: 10 }}>
                  <img src={a.image} alt={a.title} style={{ width: "100%", borderRadius: 8 }} />
                  <div style={{ marginTop: 8, fontWeight: 600 }}>{a.title}</div>
                  <button
                    onClick={() => openInfo(a.id)}
                    style={{ marginTop: 8, width: "100%", padding: "8px 10px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff" }}
                  >
                    View Info
                  </button>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
