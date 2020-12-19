import FilterView from "../view/filter";
import {render, replace, removeExemplar, RenderPosition} from "../utils/view-tools";
import {filterCapacity} from "../utils/filter.js";
import {UpdatedVersion, FilterType} from "../const.js";

export default class Filter {
  constructor(filterContainer, filterModel, cardsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._cardsModel = cardsModel;
    this._currentFilter = null;
    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._cardsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  // рисуем или перерисовываем табло фильтров
  init() {
    this._currentFilter = this._filterModel.getFilter(); // `all` `watchlist` `history` `favorites`
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(this._getFilters(), this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    removeExemplar(prevFilterComponent);
  }

  // дает контекст init и вызывает его
  _handleModelEvent() {
    this.init();
  }

  // меняет текущий фильтр, если надо
  // в модели фильтра меняет текущий фильтр
  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    // вызываем знакомую команду notify
    this._filterModel.setFilter(UpdatedVersion.MAJOR, filterType);
  }

  _getFilters() {
    const cards = this._cardsModel.getCards();
    // {
    //   main: [],
    //   rated: [],
    //   commented: [],
    //   default: []
    // };
    return [
      {
        idName: FilterType.ALL,
        title: `All Movies`,
        count: filterCapacity[FilterType.ALL](cards.main).length
      },
      {
        idName: FilterType.WATCHLIST,
        title: `Watchlist`,
        count: filterCapacity[FilterType.WATCHLIST](cards.main).length
      },
      {
        idName: FilterType.HISTORY,
        title: `History`,
        count: filterCapacity[FilterType.HISTORY](cards.main).length
      },
      {
        idName: FilterType.FAVORITES,
        title: `Favorites`,
        count: filterCapacity[FilterType.FAVORITES](cards.main).length
      }
    ];
  }
}
