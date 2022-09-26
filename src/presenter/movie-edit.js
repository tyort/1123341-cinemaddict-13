import MovieEditView from "../view/movie-edit.js";
import {removeExemplar, render} from "../utils/view-tools.js";
import {UpdatedVersion, UpdateMovie} from "../const.js";

const Mode = {
  SHOW_POPUP: `SHOW_POPUP`,
  DEL_POPUP: `DEL_POPUP`
};

const body = document.querySelector(`body`);

export default class MovieEdit {
  constructor(cardDataChange) {
    this._cardEditContainer = body;
    this._cardDataChange = cardDataChange;
    this._cardEditComponent = null;
    this._mode = Mode.DEL_POPUP;
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._ctrlEnterKeyDownHandler = this._ctrlEnterKeyDownHandler.bind(this);
  }

  createTotally(card) {
    this._card = card;
    const oldEdit = this._cardEditComponent;
    this._cardEditComponent = new MovieEditView(this._card);
    this._cardEditComponent.setCloseClickHandler(this._handleCloseClick);

    removeExemplar(oldEdit);
    render(this._cardEditContainer, this._cardEditComponent);
    this._mode = Mode.SHOW_POPUP;
    body.classList.toggle(`hide-overflow`, true);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    document.addEventListener(`keydown`, this._ctrlEnterKeyDownHandler);
  }

  _handleCloseClick() {
    const cardEdit = this._cardEditComponent;
    cardEdit.getElement().querySelector(`.film-details__add-emoji-label`).innerHTML = ``;
    cardEdit.getElement().querySelector(`textarea`).value = ``;
    removeExemplar(cardEdit);

    this._cardEditContainer.classList.toggle(`hide-overflow`, false);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    document.removeEventListener(`keydown`, this._ctrlEnterKeyDownHandler);
    this._mode = Mode.DEL_POPUP;
  }

  deletePopup() {
    this._handleCloseClick();
  }

  _ctrlEnterKeyDownHandler(evt) {
    if (evt.keyCode === 13 && evt.ctrlKey) {
      evt.preventDefault();

      this._cardDataChange(
          UpdateMovie.POPUP_AT_ALL,
          UpdatedVersion.MAJOR,
          this._cardEditComponent.parseDataToCard()
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

  setViewState() {
    const parsedCard = this._cardEditComponent.parseCardToData(this._card);
    this._cardEditComponent.shake(() => {
      this._cardEditComponent.updateParsedCard(parsedCard);
    });
    document.addEventListener(`keydown`, this._ctrlEnterKeyDownHandler);
  }
}
