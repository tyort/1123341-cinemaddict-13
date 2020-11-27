import {createElement} from "../utils.js";

const createShowMoreTemplate = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class ShowMore {
  constructor() {
    this._element = null;
  }

  getTemplate() { // метод создает строковый шаблон, а ниже превращает в DOM-элемент
    return createShowMoreTemplate();
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
