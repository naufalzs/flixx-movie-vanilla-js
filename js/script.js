const BASE_URL = "https://api.themoviedb.org/3";
const BASE_IMG_URL = "https://image.tmdb.org/t/p/w500";
const API_KEY_MOVIEDB =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMDc2MjllMTZlZjBiYTFjODgwNjNmMDA2ZGVhNWNlZCIsIm5iZiI6MTc1MzE4MTE2MC4xODgsInN1YiI6IjY4N2Y2YmU4N2IwMWYxMDkyNjE2YTkyYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.G66eely7gMyY3mk0EdSHbo_pVVn72vKSHq03rxoOtUg";

const global = {
  currentPage: window.location.pathname,
};

const toggleSpinner = () => {
  const spinner = document.querySelector(".spinner");
  spinner.classList.toggle("show");
};

async function fetchMovies(endpoint) {
  let data;
  toggleSpinner();
  try {
    const response = await fetch(BASE_URL + endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY_MOVIEDB}`,
      },
    });
    data = await response.json();
  } catch (error) {
    console.error("error display movie ", error);
  } finally {
    toggleSpinner();
    return data;
  }
}

function getURLQuery(key) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  return urlParams.get(key);
}

function highlightActiveLink() {
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    const linkUrl = link.getAttribute("href");
    if (
      linkUrl === global.currentPage ||
      (linkUrl === "/" && global.currentPage === "/index.html")
    ) {
      link.classList.add("active");
    }
  });
}

// Init App
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displayPopularMovies();
      break;
    case "/shows.html":
      displayPopularTV();
      break;
    case "/movie-details.html":
      displayMovieDetail();
      break;
    case "/tv-details.html":
      displayShowDetail();
      break;
    case "/search.html":
      console.log("search page");
      break;
    default:
      return;
  }

  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);

async function displayPopularMovies() {
  const data = await fetchMovies("/movie/popular");

  if (!data) return;

  const movieList = document.getElementById("popular-movies");
  movieList.innerHTML = "";

  data?.results?.map((movie) => {
    const { id, title, release_date: _release_date, poster_path } = movie || {};
    const release_date =
      _release_date?.split("-").reverse().join("-") ?? "XX/XX/XXXX";

    const movieEl = document.createElement("div");
    movieList.append(movieEl);
    movieEl.outerHTML = `
      <div class="card">
        <a href="movie-details.html?id=${id}">
          <img
            src=${
              poster_path
                ? `${BASE_IMG_URL}/${poster_path}.jpg`
                : "images/no-image.jpg"
            }
            class="card-img-top"
            alt="${title ?? "Movie Title"}"
          />
        </a>
        <div class="card-body">
          <h5 class="card-title">${title ?? "Movie Title"}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${release_date}</small>
          </p>
        </div>
      </div>
    `;
  });
}

async function displayPopularTV() {
  const data = await fetchMovies("/tv/popular");

  if (!data) return;

  const showList = document.getElementById("popular-shows");
  showList.innerHTML = "";

  data?.results?.map((tv) => {
    const { id, name, first_air_date: _first_air_date, poster_path } = tv || {};
    const release_date =
      _first_air_date?.split("-").reverse().join("-") ?? "XX/XX/XXXX";

    const showEl = document.createElement("div");
    showList.append(showEl);
    showEl.outerHTML = `
      <div class="card">
        <a href="tv-details.html?id=${id}">
          <img
            src=${
              poster_path
                ? `${BASE_IMG_URL}/${poster_path}.jpg`
                : "images/no-image.jpg"
            }
            class="card-img-top"
            alt="${name ?? "Show Title"}"
          />
        </a>
        <div class="card-body">
          <h5 class="card-title">${name ?? "Movie Title"}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${release_date}</small>
          </p>
        </div>
      </div>
    `;
  });
}

async function displayMovieDetail() {
  const id = getURLQuery("id");

  const data = await fetchMovies(`/movie/${id}`);
  const {
    backdrop_path,
    poster_path,
    title,
    vote_average,
    release_date: _release_date,
    overview,
    genres,
    homepage,
    budget,
    revenue,
    runtime,
    production_companies,
  } = data || {};
  const release_date =
    _release_date?.split("-").reverse().join("-") ?? "XX/XX/XXXX";
  const released = new Date() > new Date(_release_date);

  const movieDetails = document.getElementById("movie-details");
  movieDetails.outerHTML = `
    <div id="movie-details">
      <div class="details-top">
        <div>
          <img
            src=${
              poster_path
                ? `${BASE_IMG_URL}/${poster_path}.jpg`
                : "images/no-image.jpg"
            }
            class="card-img-top"
            alt="${title ?? "Movie Title"}"
          />
        </div>
        <div>
          <h2>${title ?? "Movie Title"}</h2>
          <p>
            <i class="fas fa-star text-primary"></i>
            ${vote_average ?? 0} / 10
          </p>
          <p class="text-muted">Release Date: ${release_date}</p>
          <p>
            ${
              overview ??
              `Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
            atque molestiae error debitis provident dolore hic odit, impedit
            sint, voluptatum consectetur assumenda expedita perferendis
            obcaecati veritatis voluptatibus. Voluptatum repellat suscipit,
            quae molestiae cupiditate modi libero dolorem commodi obcaecati!
            Ratione quia corporis recusandae delectus perspiciatis consequatur
            ipsam. Cumque omnis ad recusandae.`
            }
          </p>
          <h5>Genres</h5>
          <ul class="list-group">
            ${genres?.map((genre) => `<li>${genre.name}</li>`).join("")}
          </ul>
          <a href="${
            homepage ?? "#"
          }" target="_blank" class="btn">Visit Movie Homepage</a>
        </div>
      </div>
      <div class="details-bottom">
        <h2>Movie Info</h2>
        <ul>
          <li><span class="text-secondary">Budget:</span> $${budget}</li>
          <li><span class="text-secondary">Revenue:</span> $${revenue}</li>
          <li><span class="text-secondary">Runtime:</span> ${runtime} minutes</li>
          <li><span class="text-secondary">Status:</span> ${
            released ? "Released" : "Coming Soon"
          }</li>
        </ul>
        <h4>Production Companies</h4>
        <div class="list-group">${production_companies?.reduce(
          (acc, company) => {
            const name = company?.name;
            return acc ? (acc += `, ${name}`) : name;
          },
          ""
        )}</div>
      </div>
    </div>
  `;
}

async function displayShowDetail() {
  const id = getURLQuery("id");

  const data = await fetchMovies(`/tv/${id}`);
  const {
    backdrop_path,
    poster_path,
    name,
    vote_average,
    first_air_date: _first_air_date,
    overview,
    genres,
    homepage,
    number_of_episodes,
    last_episode_to_air,
    production_companies,
  } = data || {};
  const release_date =
    _first_air_date?.split("-").reverse().join("-") ?? "XX/XX/XXXX";
  const released = new Date() > new Date(_first_air_date);

  const showDetails = document.getElementById("show-details");
  showDetails.outerHTML = `
    <div id="show-details">
      <div class="details-top">
        <div>
          <img
            src=${
              poster_path
                ? `${BASE_IMG_URL}/${poster_path}.jpg`
                : "images/no-image.jpg"
            }
            class="card-img-top"
            alt="${name ?? "Show Name"}"
          />
        </div>
        <div>
          <h2>${name ?? "Show Name"}</h2>
          <p>
            <i class="fas fa-star text-primary"></i>
            ${vote_average ?? 0} / 10
          </p>
          <p class="text-muted">Release Date: ${release_date}</p>
          <p>
            ${
              overview ??
              `Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
            atque molestiae error debitis provident dolore hic odit, impedit
            sint, voluptatum consectetur assumenda expedita perferendis
            obcaecati veritatis voluptatibus. Voluptatum repellat suscipit,
            quae molestiae cupiditate modi libero dolorem commodi obcaecati!
            Ratione quia corporis recusandae delectus perspiciatis consequatur
            ipsam. Cumque omnis ad recusandae.`
            }
          </p>
          <h5>Genres</h5>
          <ul class="list-group">
            ${genres?.map((genre) => `<li>${genre.name}</li>`).join("")}
          </ul>
          <a href="${
            homepage ?? "#"
          }" target="_blank" class="btn">Visit Movie Homepage</a>
        </div>
      </div>
      <div class="details-bottom">
        <h2>Show Info</h2>
        <ul>
          <li><span class="text-secondary">Number Of Episodes:</span> ${number_of_episodes}</li>
          <li>
            <span class="text-secondary">Last Episode To Air:</span> ${
              last_episode_to_air?.name
            }
          </li>
          <li><span class="text-secondary">Status:</span> ${
            released ? "Released" : "Coming Soong"
          }</li>
        </ul>
        <h4>Production Companies</h4>
        <div class="list-group">${production_companies?.reduce(
          (acc, company) => {
            const name = company?.name;
            return acc ? (acc += `, ${name}`) : name;
          },
          ""
        )}</div>
      </div>
    </div>
  `;
}
