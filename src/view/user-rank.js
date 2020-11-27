import {createElement} from "../utils.js";

const createUserRankTemplate = () => {
  return `<section class="header__profile profile">
    <p class="profile__rating">Movie Buff</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserRank {
  constructor() {
    this._element = null;
  }

  getTemplate() { // метод создает строковый шаблон, а ниже превращает в DOM-элемент
    return createUserRankTemplate();
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
