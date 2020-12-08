import {render, removeExemplar} from "../utils/view-tools";
import MovieEdit from "../view/movie-edit.js";
import MovieCard from "../view/movie-card.js";
const body = document.querySelector(`body`);


export default class CardPresenter {
  constructor() {
    this._cardComponent = null;
    this._cardEditComponent = new MovieEdit();
    this._renderPopupHandler = this._renderPopupHandler.bind(this);
    this._deletePopupHandler = this._deletePopupHandler.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  init(container, card) {
    this._card = card;
    this._cardComponent = new MovieCard(this._card);
    this._cardComponent.setEditClickHandler(this._renderPopupHandler);

    render(container, this._cardComponent);
  }

  _renderPopupHandler() {
    this._cardEditComponent.currentCard = this._card;
    render(body, this._cardEditComponent);
    body.classList.toggle(`hide-overflow`, true);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._cardEditComponent.setCloseClickHandler(this._deletePopupHandler);
  }

  _deletePopupHandler() {
    removeExemplar(this._cardEditComponent);
    body.classList.toggle(`hide-overflow`, false);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._deletePopupHandler();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
