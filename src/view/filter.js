import Abstract from "./abstract.js";

const createFilterTemplate = (filters, currentFilterType) => {
  return filters
    .map((filter) => {
      const {idName, title, count} = filter;
      return (
        `<a 
          href="#${idName}"
          class="main-navigation__item ${idName === currentFilterType ? `main-navigation__item--active` : ``}"
          ${count === 0 ? `disabled` : ``}
          data-filter-name="${idName}">
          ${title}
          <span class="main-navigation__item-count">${count}</span>
        </a>`
      );
    })
    .join(``);
};

const createMainItems = (filters, currentFilterType) => {
  return (
    `<div class="main-navigation__items">
        ${createFilterTemplate(filters, currentFilterType)}
    </div>`
  );
};

export default class Filter extends Abstract {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createMainItems(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName === `A`) {
      evt.preventDefault();
      this._handler.filterTypeChange(evt.target.dataset.filterName);
    }
  }

  setFilterTypeChangeHandler(exactFormula) {
    this._handler.filterTypeChange = exactFormula;
    this.getElement().addEventListener(`click`, this._filterTypeChangeHandler);
  }
}
