import {createElement} from "../utils.js";

const createAllMoviesTemplate = () => {
  return `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
    </section>

    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container"></div>
    </section>

    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container">
    </section>
  </section>`;
};

export default class AllMovies {
  constructor() {
    this._element = null;
  }

  getTemplate() { // метод создает строковый шаблон, а ниже превращает в DOM-элемент
    return createAllMoviesTemplate();
  }

  getElement() { // метод превращает в DOM-элемент полученную строку сверху
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
