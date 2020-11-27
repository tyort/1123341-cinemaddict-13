import {createElement} from "../utils.js";

const createFilterItemTemplate = (filter) => {
  const {name, count} = filter;
  const filterName = name !== `all`
    ? `${name.slice(0, 1).toUpperCase()}${name.slice(1)}`
    : `All movies`;

  return `<a href="#${name}" class="main-navigation__item">
      ${filterName} <span class="main-navigation__item-count">${count}</span>
    </a>`;
};

const createMenuTemplate = (filters) => {
  const filterItems = filters
    .map((filter) => createFilterItemTemplate(filter))
    .join(``);

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItems}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Menu {
  constructor(filters) {
    this._element = null;
    this._filters = filters;
  }

  getTemplate() { // метод создает строковый шаблон, а ниже превращает в DOM-элемент
    return createMenuTemplate(this._filters);
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
