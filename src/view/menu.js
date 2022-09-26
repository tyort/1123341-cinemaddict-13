import Abstract from "./abstract.js";
import {MenuItem} from "../const.js";

const createMenuTemplate = () => (
  `<nav class="main-navigation">
    <a href="#stats" class="main-navigation__additional" data-filter-name="stats">Stats</a>
  </nav>`
);

export default class Menu extends Abstract {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `A`) {
      return;
    }

    if (evt.target.dataset.filterName === `stats`) {
      this._handler.menuClick(MenuItem.STATISTICS);

    } else {
      this._handler.menuClick(MenuItem.CATALOG);
    }
  }

  setMenuClickHandler(exactFormula) {
    this._handler.menuClick = exactFormula;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }
}
