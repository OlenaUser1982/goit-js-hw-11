import axios from 'axios';

export default class ServiceApi {
  constructor() {
    this.URL = 'https://pixabay.com/api/';
    this.KEY = '40356079-0981781b33afe77096f29ce70';
    this.PAGE = 1;
    this.PER_PAGE = 40;
    this.searchQuery = '';
  }
  async fetchFoto() {
    const serchParams = new URLSearchParams({
      key: this.KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: this.PAGE,
      per_page: this.PER_PAGE,
    });
    const newParams = serchParams.toString();
    try {
      const allResponse = await axios.get(`${this.URL}?${newParams}`);
      if (allResponse.status !== 200) {
        throw new Error(allResponse.status);
      }
      const allResponseData = allResponse.data;
      return allResponseData;
    } catch (error) {
      console.log(error);
    }
  }
  get page() {
    return this.PAGE;
  }
  set page(newPage) {
    this.PAGE = newPage;
  }
  incrementPage() {
    this.PAGE += 1;
  }
  resetPage() {
    this.PAGE = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
