import MovieEditView from "../view/movie-edit.js";
import {removeExemplar, render, replace} from "../utils/view-tools.js";
import {UpdatedVersion, UpdatePopup} from "../const.js";

export default class MovieEdit {
  constructor(cardEditContainer, cardDataChange, deleteAllPopups) {
    this._cardEditContainer = cardEditContainer;
    this._cardDataChange = cardDataChange;
    this._deleteAllPopups = deleteAllPopups;
    this._cardEditComponent = null;
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._popupChangeOnly = this._popupChangeOnly.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._ctrlEnterKeyDownHandler = this._ctrlEnterKeyDownHandler.bind(this);
  }

  createTotally(card) {
    this._card = card;
    const oldEdit = this._cardEditComponent;

    this._cardEditComponent = new MovieEditView(this._card);
    this._cardEditComponent.setCloseClickHandler(this._handleCloseClick);
    this._cardEditComponent.setPopupChangeOnly(this._popupChangeOnly);

    if (oldEdit === null) {
      render(this._cardEditContainer, this._cardEditComponent);
    } else {
      replace(this._cardEditComponent, oldEdit);
    }

    removeExemplar(oldEdit);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _handleCloseClick() {
    const cardEdit = this._cardEditComponent.getElement();

    cardEdit.querySelector(`.film-details__add-emoji-label`).innerHTML = ``;
    cardEdit.querySelector(`textarea`).value = ``;
    cardEdit.remove();

    this._cardEditContainer.classList.toggle(`hide-overflow`, false);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    document.removeEventListener(`keydown`, this._ctrlEnterKeyDownHandler);
  }

  deletePopup() {
    this._handleCloseClick();
  }

  _ctrlEnterKeyDownHandler(evt) {
    if (evt.keyCode === 13 && evt.ctrlKey) {
      evt.preventDefault();
      this._handleCloseClick();
      this._cardDataChange(
          UpdatePopup.POPUP_AT_ALL,
          UpdatedVersion.MINOR,
          Object.assign(
              this._card,
              this._cardForSave
          )
      );
      document.removeEventListener(`keydown`, this._ctrlEnterKeyDownHandler);
    }
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._cardEditComponent.reset(this._card);
      this._handleCloseClick();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _popupChangeOnly(card) {
    this._cardForSave = card;
  }
}
