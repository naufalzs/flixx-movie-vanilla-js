const BASE_URL = "https://api.themoviedb.org/3";
const BASE_IMG_URL = "https://image.tmdb.org/t/p";
const API_KEY_MOVIEDB = "";

const global = {
  currentPage: window.location.pathname,
  search: {
    type: "",
    term: "",
    page: 1,
    total_pages: 1,
    total_results: 1,
  },
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

async function fetchSearch() {
  let data;
  const type = global.search.type;
  const params = new URLSearchParams();
  params.append("query", global.search.term);
  params.append("page", global.search.page);

  toggleSpinner();
  try {
    const response = await fetch(`${BASE_URL}/search/${type}?${params}`, {
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

function showAlert(message, type = "error") {
  const alert = document.querySelector("#alert");
  alert.classList.add("alert");
  alert.classList.add(type);
  alert.appendChild(document.createTextNode(message));

  setTimeout(() => {
    alert.remove();
  }, 3000);
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
      displaySearchPage();
      break;
    default:
      return;
  }

  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);

async function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    autoPlay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

async function displaySlider() {
  const { results } = await fetchMovies("/movie/now_playing");
  const swiperContainer = document.querySelector(".swiper-wrapper");
  results?.map((movie) => {
    const { id, title, poster_path, vote_average: _vote_average } = movie || {};
    const vote_average = Number(_vote_average).toFixed(2);

    const swiperSlide = document.createElement("div");
    swiperContainer.append(swiperSlide);
    swiperSlide.outerHTML = `
      <div class="swiper-slide">
        <a href="movie-details.html?id=${id}">
          <img
            src=${
              poster_path
                ? `${BASE_IMG_URL}/w500/${poster_path}.jpg`
                : "images/no-image.jpg"
            }
            alt="${title ?? "Movie Title"}"
          />
        </a>
        <h4 class="swiper-rating">
          <i class="fas fa-star text-secondary"></i> ${vote_average} / 10
        </h4>
      </div>
    `;
  });

  initSwiper();
}

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
                ? `${BASE_IMG_URL}/w500/${poster_path}.jpg`
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

  displaySlider();
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
                ? `${BASE_IMG_URL}/w500/${poster_path}.jpg`
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
                ? `${BASE_IMG_URL}/w500/${poster_path}.jpg`
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

  displayBackgroundImage("movies", backdrop_path);
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
                ? `${BASE_IMG_URL}/w500/${poster_path}.jpg`
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

  displayBackgroundImage("show", backdrop_path);
}

async function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(${BASE_IMG_URL}/original/${backgroundPath})`;
  overlayDiv.style.zIndex = -1;
  overlayDiv.style.opacity = 0.2;
  overlayDiv.classList.add("bg-image");

  let container;
  if (type === "movies") {
    container = document.getElementById("movie-details");
  } else {
    container = document.getElementById("show-details");
  }
  console.log(container);
  console.log(overlayDiv);
  container.appendChild(overlayDiv);
}

function syncSearchInput() {
  const searchForm = document.querySelector(".search-form");
  const searchInput = searchForm.querySelector("#search-term");
  searchInput.value = global.search.term;

  const inputsRadio = searchForm.querySelectorAll('input[type="radio"]');
  inputsRadio.forEach((inputRadio) => {
    inputRadio.removeAttribute("checked");

    const radioValue = inputRadio.getAttribute("value");
    if (radioValue === global.search.type) {
      inputRadio.setAttribute("checked", true);
    }
  });
}

async function getSearchResult() {
  const { results, total_pages, total_results } = await fetchSearch();
  global.search.total_pages = total_pages;
  global.search.total_results = total_results;

  displaySearchResult(results);
}

async function displaySearchPage() {
  global.search.type = getURLQuery("type");
  global.search.term = getURLQuery("search-term");

  if (global.search.term === "") return showAlert("Please enter a Search Term");

  const params = new URLSearchParams();
  params.append("query", global.search.term);

  syncSearchInput();

  getSearchResult();
}

async function displaySearchResult(results) {
  const type = global.search.type;

  const resultContainer = document.getElementById("search-results");
  resultContainer.innerHTML = "";
  results?.map((item) => {
    const { id, poster_path } = item || {};
    let title;
    let _releaseDate;

    if (type === "movie") {
      title = item?.title;
      _releaseDate = item?.release_date;
    } else {
      title = item?.name;
      _releaseDate = item?._first_air_date;
    }

    const releaseDate =
      _releaseDate?.split("-").reverse().join("-") ?? "XX/XX/XXXX";

    const itemEl = document.createElement("div");
    resultContainer.appendChild(itemEl);
    itemEl.outerHTML = `
      <div class="card">
        <a href="${type}-details.html?id=${id}">
          <img
            src=${
              poster_path
                ? `${BASE_IMG_URL}/w500/${poster_path}.jpg`
                : "images/no-image.jpg"
            }
            class="card-img-top"
            alt="${title ?? `${type} Title`}"
          />
        </a>
        <div class="card-body">
          <h5 class="card-title">${title ?? `Movie Or Show Name`}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${releaseDate}</small>
          </p>
        </div>
      </div>
    `;
  });

  const total_results = global.search.total_results;

  const searchHeading = document.querySelector("#search-results-heading");
  searchHeading.innerHTML = "";
  searchHeading.innerHTML = `
    <h2>${results?.length} of ${total_results}</h2>
  `;

  displayPagination();
}

function displayPagination() {
  const prevBtn = document.querySelector("#prev");
  const nextBtn = document.querySelector("#next");
  const pageCounter = document.querySelector(".page-counter");

  const page = global.search.page;
  const total_pages = global.search.total_pages;

  if (page === 1) {
    prevBtn.disabled = true;
  }

  if (page === total_pages) {
    nextBtn.disabled = true;
  }

  pageCounter.innerHTML = "";
  pageCounter.append(document.createTextNode(`Page ${page} of ${total_pages}`));

  prevBtn.addEventListener("click", () => {
    global.search.page--;
    getSearchResult();
  });

  nextBtn.addEventListener("click", () => {
    global.search.page++;
    getSearchResult();
  });
}
