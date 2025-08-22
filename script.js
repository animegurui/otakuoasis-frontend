// The base URL of our backend API. For local dev, it's localhost.
// On deployment, this will be our production URL, but Vercel will handle it.
const API_BASE_URL = 'http://localhost:3001';

document.addEventListener('DOMContentLoaded', () => {
    // Now fetch from our own server's endpoint
    fetchAndDisplayAnime(`${API_BASE_URL}/api/top-airing`, 'top-airing-grid');
    // You would create more endpoints on your server for other sections
});

async function fetchAndDisplayAnime(apiUrl, containerId) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`API request failed: ${response.status}`);
        const data = await response.json();
        
        // The rest of the display logic is the same as before
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = ''; 
        
        data.data.forEach(anime => {
            const animeCard = document.createElement('div');
            animeCard.className = 'anime-card';
            animeCard.innerHTML = `
                <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
                <div class="overlay">
                    <div class="title">${anime.title}</div>
                </div>
            `;
            container.appendChild(animeCard);
        });

    } catch (error) {
        console.error(`Could not fetch data for ${containerId}:`, error);
    }
}
