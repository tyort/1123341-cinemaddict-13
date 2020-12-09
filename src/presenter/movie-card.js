import {render, removeExemplar} from "../utils/view-tools";
import MovieEdit from "../view/movie-edit.js";
import MovieCard from "../view/movie-card.js";
const body = document.querySelector(`body`);


export default class CardPresenter {
  constructor() {
    this._cardComponent = null;
    this._cardEditComponent = new MovieEdit();
    this._cardClickHandler = this._cardClickHandler.bind(this);
    this._closeClickhandler = this._closeClickhandler.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._allCardsPresenters = {};
  }

  init(container, card) {
    this._card = card;
    this._cardComponent = new MovieCard(this._card);
    this._cardComponent.setEditClickHandler(this._cardClickHandler);

    render(container, this._cardComponent);
  }

  destroy() {
    removeExemplar(this._cardComponent);
  }

  _cardClickHandler() {
    this._cardEditComponent.currentCard = this._card;
    render(body, this._cardEditComponent);
    body.classList.toggle(`hide-overflow`, true);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._cardEditComponent.setCloseClickHandler(this._closeClickhandler);
  }

  _closeClickhandler() {
    removeExemplar(this._cardEditComponent);
    body.classList.toggle(`hide-overflow`, false);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._closeClickhandler();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
