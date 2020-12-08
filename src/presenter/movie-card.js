import {render, removeExemplar} from "../utils/view-tools";
import MovieEdit from "../view/movie-edit.js";
const body = document.querySelector(`body`);


export default class MovieCard {
  constructor() {
    this._cardComponent = null;
    this._cardEditComponent = new MovieEdit();
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
