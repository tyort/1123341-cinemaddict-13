import Abstract from "./abstract.js";

const createFilterTemplate = (filters, currentFilterType) => {
  return filters
    .map((filter) => {
      const {idName, title, count} = filter;
      return (
        `<a 
          href="#${idName}"
          class="main-navigation__item"
          ${idName === currentFilterType ? `checked` : ``}
          ${count === 0 ? `disabled` : ``}
          value="${idName}">
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
    evt.preventDefault();
    this._handler.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(exactFormula) {
    this._handler.filterTypeChange = exactFormula;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}

// [{idName: `all`, title: `All movies`, count: 0}], `all`
