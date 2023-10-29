import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ServiceApi from './imgApi.js';

let lightbox = new SimpleLightbox('.foto-link', {
  captionsData: 'alt',
  captionDelay: 250,
});

const searchForm = document.querySelector('.search-form');
const galery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

const serviceApi = new ServiceApi();

searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  serviceApi.searchQuery = e.currentTarget.elements.searchQuery.value;
  allClear();
  if (serviceApi.query === '') {
    allClear();
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  serviceApi.resetPage();
  serviceApi
    .fetchFoto()
    .then(date => {
      const { hits, totalHits } = date;
      if (hits.length === 0) {
        allClear();
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      loadMore.classList.remove('is-hiden');
      murkup(date);
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    })
    .catch(error => console.log(error));
}

function murkup(date) {
  let murkupGalery = date.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class = "foto-link" href = "${largeImageURL}"><div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width = 300 />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div></a>`;
      }
    )
    .join();
  galery.insertAdjacentHTML('beforeend', murkupGalery);
  lightbox.refresh();
}

function allClear() {
  galery.innerHTML = '';
}

loadMore.addEventListener('click', pagination);

function pagination(e) {
  e.preventDefault();
  serviceApi.incrementPage();
  serviceApi.fetchFoto().then(date => {
    const { totalHits } = date;
    murkup(date);
    if (totalHits <= serviceApi.PER_PAGE * serviceApi.PAGE) {
      loadMore.classList.add('is-hiden');
      Notiflix.Notify.success(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}
