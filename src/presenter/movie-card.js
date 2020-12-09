import {render, removeExemplar, replace} from "../utils/view-tools";
import MovieEdit from "../view/movie-edit.js";
import MovieCard from "../view/movie-card.js";
const body = document.querySelector(`body`);


export default class CardPresenter {
  constructor() {
    this._cardComponent = null;
    this._cardEditComponent = new MovieEdit();
    this._cardClickHandler = this._cardClickHandler.bind(this);
    this._willWatchClickHandler = this._willWatchClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._allCardsPresenters = {};
  }

  // создается экземпляр компонента карты с эксклюзивными данными
  // запихиваем в него обработчик
  // рисуем представление
  createTotally(container, card) {
    this._card = card;

    const oldCard = this._cardComponent; // либо обновленная карта, либо ничего
    this._cardComponent = new MovieCard(this._card);
    this._cardComponent.setCardClickHandler(this._cardClickHandler);
    this._cardComponent.setWillWatchClickHandler(this._willWatchClickHandler);
    this._cardComponent.setWatchedClickHandler(this._watchedClickHandler);
    this._cardComponent.setFavoriteClickHandler(this._favoriteClickHandler);

    if (oldCard === null) {
      render(container, this._cardComponent);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (container.contains(oldCard.getElement())) {
      replace(this._cardComponent, oldCard);
    }

    removeExemplar(oldCard);
  }

  destroy() {
    removeExemplar(this._cardComponent);
  }

  _cardClickHandler() {
    this._cardEditComponent.currentCard = this._card;
    render(body, this._cardEditComponent);
    body.classList.toggle(`hide-overflow`, true);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._cardEditComponent.setCloseClickHandler(this._closeClickHandler);
  }

  _willWatchClickHandler() {
    console.log(`Привет`);
  }

  _watchedClickHandler() {
    console.log(`Привет`);
  }

  _favoriteClickHandler() {
    console.log(`Привет`);
  }

  _closeClickHandler() {
    removeExemplar(this._cardEditComponent);
    body.classList.toggle(`hide-overflow`, false);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._closeClickHandler();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
