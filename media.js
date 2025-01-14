const params = new URLSearchParams(window.location.search);
const tmdbId = params.get('tmdb');
const title = decodeURIComponent(params.get('title') || 'Unknown');
const type = params.get('type');

const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = 'https://api.movies.cortexakademija.com/tmdb-token';
let API_KEY = '';

async function getApiKey() {
    try {
        const response = await fetch(API_URL);
        API_KEY = await response.text();
        if (tmdbId && type) {
            fetchMediaDetails(tmdbId, type);
        } else {
            console.error("Missing required parameters.");
        }
    } catch (error) {
        console.error('Error getting API key:', error);
    }
}

async function fetchMediaDetails(id, mediaType) {
    try {
        const url = `${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}&language=en-US`;
        const response = await fetch(url);
        const data = await response.json();

        displayMediaDetails(data, mediaType);
    } catch (error) {
        console.error('Error fetching media details:', error);
    }
}

function displayMediaDetails(data, mediaType) {
    const posterImg = document.getElementById('poster-img');
    const mediaTitle = document.getElementById('media-title');
    const releaseDate = document.getElementById('release-date');
    const typeElement = document.getElementById('type');
    const overview = document.getElementById('overview');

    posterImg.src = data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : 'https://via.placeholder.com/400x600?text=No+Image';
    mediaTitle.textContent = data.title || data.name || 'Unknown Title';
    releaseDate.textContent = data.release_date || data.first_air_date || 'Unknown';
    typeElement.textContent = mediaType.charAt(0).toUpperCase() + mediaType.slice(1);
    overview.textContent = data.overview || 'No description available.';
}

getApiKey();
