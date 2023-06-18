const apiKey = '6ba9e974'; // Replace with your OMDb API key

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('resultsContainer');
const paginationContainer = document.getElementById('pagination');
const itemsPerPage = 10;

searchButton.addEventListener('click', searchMovies);

function searchMovies() {
  const searchTerm = searchInput.value.trim();

  if (searchTerm === '') {
    resultsContainer.innerHTML = '';
    return;
  }

  const apiUrl = `http://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=${apiKey}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => displayResults(data.Search))
    .catch(error => console.log('Error:', error));
}

function displayResults(movies) {
  if (!movies) {
    resultsContainer.innerHTML = '<p>No movies found.</p>';
    paginationContainer.innerHTML = '';
    return;
  }

  resultsContainer.innerHTML = '';
  paginationContainer.innerHTML = '';

  const totalPages = Math.ceil(movies.length / itemsPerPage);
  let currentPage = 1;
  showMovies(currentPage, movies);

  // Pagination
  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement('button');
    pageLink.classList.add('page-link');
    pageLink.innerText = i;
    pageLink.addEventListener('click', function() {
      currentPage = i;
      showMovies(currentPage, movies);
    });
    paginationContainer.appendChild(pageLink);
  }
}

function showMovies(page, movies) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedMovies = movies.slice(start, end);

  resultsContainer.innerHTML = '';
// instructon for paginated movies
  paginatedMovies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
// movie poster
    const moviePoster = document.createElement('img');
    moviePoster.classList.add('movie-poster');
    moviePoster.src = movie.Poster !== 'N/A' ? movie.Poster : 'no-poster.jpg';
    movieCard.appendChild(moviePoster);

    const movieDetails = document.createElement('div');
    movieDetails.classList.add('movie-details');
// movie title and year of release
    const movieTitle = document.createElement('h2');
    movieTitle.classList.add('movie-title');
    movieTitle.textContent = movie.Title;
    movieDetails.appendChild(movieTitle);

    const movieYear = document.createElement('h3');
    movieYear.classList.add('movie-year');
    movieYear.textContent = movie.Year;
    movieDetails.appendChild(movieYear);


    const viewDetailsButton = document.createElement('button');
    viewDetailsButton.classList.add('btn');
    viewDetailsButton.textContent = 'View Details';
    viewDetailsButton.addEventListener('click', function() {
      fetchMovieDetails(movie.imdbID);
    });
    movieDetails.appendChild(viewDetailsButton);

    movieCard.appendChild(movieDetails);
    resultsContainer.appendChild(movieCard);
  });
}
// fetch data from the api
function fetchMovieDetails(imdbID) {
  const apiUrl = `http://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${apiKey}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => displayMovieDetails(data))
    .catch(error => console.log('Error:', error));
}
// view more details information
function displayMovieDetails(movie) {
  const movieDetails = `
    <div>
      <h2>${movie.Title}</h2>
      <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'no-poster.jpg'}" alt="${movie.Title}">
      <p><strong>Plot:</strong> ${movie.Plot}</p>
      <p><strong>Actors:</strong> ${movie.Actors}</p>
      <p><strong>Director:</strong> ${movie.Director}</p>
      <p><strong>Genre:</strong> ${movie.Genre}</p>
      <p><strong>Release Year:</strong> ${movie.Year}</p>
      <p><strong>Runtime:</strong> ${movie.Runtime}</p>
      <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
    </div>
  `;

  resultsContainer.innerHTML = movieDetails;
  paginationContainer.innerHTML = '';
}
