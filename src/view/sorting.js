import Abstract from "./abstract.js";
import {SortType} from "../const.js";

const createSortTemplate = (checkedSortType) => {
  const isDefaultActive = SortType.DEFAULT === checkedSortType ? `sort__button--active` : ``;
  const isDateActive = SortType.DATE === checkedSortType ? `sort__button--active` : ``;
  const isRateActive = SortType.RATING === checkedSortType ? `sort__button--active` : ``;

  return `<ul class="sort">
    <li><a href="#" class="sort__button ${isDefaultActive}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${isDateActive}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${isRateActive}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`;
};

export default class Sort extends Abstract {
  constructor(checkedSortType) {
    super();
    this._checkedSortType = checkedSortType;
    this._handler = {};
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._checkedSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._handler.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(exactFormula) {
    this._handler.sortTypeChange = exactFormula;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
