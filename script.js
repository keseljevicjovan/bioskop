const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = 'http://api.movies.cortexakademija.com/tmdb-token';
let API_KEY = '';

const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');

async function getApiKey() {
    try {
        const response = await fetch(API_URL);
        API_KEY = await response.text();
    } catch (error) {
        console.error('Error getting API key:', error);
    }
}

async function searchMovies(query) {
    if (!query || !API_KEY) return;

    const encodedQuery = encodeURIComponent(query);
    const url = `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodedQuery}&language=en-US`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.total_results === 0) {
            resultsContainer.innerHTML = '<p>No results found.</p>';
            return;
        }

        displayResults(data.results);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayResults(results) {
    resultsContainer.innerHTML = '';

    results.forEach(result => {
        if (result.media_type !== 'movie' && result.media_type !== 'tv') return;
        
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.onclick = () => openMediaPage(result);

        const imageUrl = result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image';
        const title = result.title || result.name;
        const year = result.release_date ? result.release_date.split('-')[0] : result.first_air_date.split('-')[0];
        
        resultItem.innerHTML = `
            <img src="${imageUrl}" alt="${title}">
            <h3>${title}</h3>
            <p>${year}</p>
        `;

        resultsContainer.appendChild(resultItem);
    });

    resultsContainer.style.opacity = 1;
    resultsContainer.style.transform = 'translateY(0)';
}

function openMediaPage(result) {
    const mediaType = result.media_type === 'movie' ? 'movie' : 'tv';
    const mediaId = result.id;

    const url = `http://localhost:3000/${mediaType}/${mediaId}`;
    window.location.href = url;
}

function scrollToResults() {
    window.scrollTo({
        top: resultsContainer.offsetTop - 50,
        behavior: 'smooth'
    });
}

searchInput.addEventListener('input', (event) => {
    const query = event.target.value;
    searchMovies(query);
});

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const query = searchInput.value;
        searchMovies(query);
        scrollToResults();
    }
});

getApiKey();
