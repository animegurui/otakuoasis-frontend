const API_BASE = "https://otakuoasis-backend.onrender.com/api";

async function searchAnime() {
  const query = document.getElementById("searchBox").value;
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  const results = document.getElementById("results");
  results.innerHTML = "";

  data.results.forEach(a => {
    const div = document.createElement("div");
    div.className = "anime-card";
    div.innerHTML = `
      <h2>${a.title}</h2>
      <img src="${a.image}" width="150"><br>
      <button onclick="getInfo('${a.id}')">View Info</button>
    `;
    results.appendChild(div);
  });
}

async function getInfo(id) {
  const res = await fetch(`${API_BASE}/info/${id}`);
  const data = await res.json();
  const results = document.getElementById("results");
  results.innerHTML = `<h2>${data.title}</h2><p>${data.description}</p>`;

  data.episodes.forEach(ep => {
    const btn = document.createElement("button");
    btn.textContent = `Episode ${ep.number}`;
    btn.onclick = () => watchEpisode(ep.id);
    results.appendChild(btn);
  });
}

async function watchEpisode(episodeId) {
  const res = await fetch(`${API_BASE}/watch/${episodeId}`);
  const data = await res.json();
  const results = document.getElementById("results");

  results.innerHTML = `
    <video src="${data.sources[0].url}" controls autoplay width="100%"></video>
  `;
}
