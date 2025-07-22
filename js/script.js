const global = {
  currentPage: window.location.pathname
}

function highlightActiveLink () {
  const links = document.querySelectorAll('a')
  links.forEach((link) => {
    const linkUrl = link.getAttribute('href')
    if (linkUrl === global.currentPage) {
      link.classList.add('active')
    }
  })
}

// Init App
function init () {
  switch (global.currentPage) {
    case '/': 
    case '/index.html': 
      console.log('movie page');
      break;
    case '/shows.html': 
      console.log('tv shows page');
      break;
    case '/movie-details.html': 
      console.log('movie detail page');
      break;
    case '/tv-details.html': 
      console.log('tv shows detail page');
      break;
    case '/search.html': 
      console.log('search page');
      break;
    default:
      return
  }

  highlightActiveLink()
}

document.addEventListener('DOMContentLoaded', init)