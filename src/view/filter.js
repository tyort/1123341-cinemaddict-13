import Abstract from "./abstract.js";

const createFilterTemplate = (filters, currentFilterType) => {
  return filters
    .map((filter) => {
      const {idName, title, count} = filter;
      console.log(filter);
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

export default class Filter extends Abstract {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}

// [{idName: `all`, title: `All movies`, count: 0}], `all`
