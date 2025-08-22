document.addEventListener('DOMContentLoaded', () => {
    // This is the URL of our backend API.
    // We use a relative path '/api/...' because our deployment host (Vercel)
    // will smartly route this request to our backend server.
    // This avoids issues with different domains and makes the code cleaner.
    const API_ENDPOINT = '/api/top-airing';

    fetchAndDisplayAnime(API_ENDPOINT, 'top-airing-grid');
});

async function fetchAndDisplayAnime(apiUrl, containerId) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`API request failed: ${response.status}`);
        
        // The backend sends back JSON data, which we parse here.
        const data = await response.json();
        
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = ''; // Clear loading text or old content
        
        // Loop through the anime list received from the backend.
        data.data.forEach(anime => {
            const animeCard = document.createElement('div');
            animeCard.className = 'anime-card';
            // Create the HTML for the card using the data.
            animeCard.innerHTML = `
                <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
                <div class="overlay">
                    <div class="title">${anime.title}</div>
                </div>
            `;
            container.appendChild(animeCard);
        });

    } catch (error) {
        console.error(`Could not display anime:`, error);
        // Display an error message to the user on the page
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `<p style="color: #ff6b6b;">Failed to load anime. Please try again later.</p>`;
        }
    }
}
