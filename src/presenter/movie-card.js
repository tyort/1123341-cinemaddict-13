import {render, removeExemplar, replace} from "../utils/view-tools";
import MovieCard from "../view/movie-card.js";
import {UpdatePopup, UpdatedVersion} from "../const.js";

const Mode = {
  SHOW_POPUP: `SHOW_POPUP`,
  DEL_POPUP: `DEL_POPUP`
};

export default class CardPresenter {
  constructor(cardContainer, cardDataChange) {
    this._cardContainer = cardContainer;
    this._cardDataChange = cardDataChange;
    this._cardComponent = null;
    this._mode = Mode.DEL_POPUP;
    this._handleCardClick = this._handleCardClick.bind(this);
    this._handleWillWatchClick = this._handleWillWatchClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  // создается экземпляр компонента карты с эксклюзивными данными
  // запихиваем в него обработчики
  // рисуем представление
  // также перезаписываем обновленную карту
  createTotally(card) {
    this._card = card;
    const oldCard = this._cardComponent;
    this._cardComponent = new MovieCard(this._card);
    this._cardComponent.setCardClickHandler(this._handleCardClick);
    this._cardComponent.setWillWatchClickHandler(this._handleWillWatchClick);
    this._cardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._cardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (oldCard === null) {
      render(this._cardContainer, this._cardComponent);
      return;
    }

    replace(this._cardComponent, oldCard);
    removeExemplar(oldCard);
  }

  destroy() {
    removeExemplar(this._cardComponent);
  }

  _handleCardClick() {
    this._cardDataChange(
        UpdatePopup.POPUP_AT_ALL,
        UpdatedVersion.PATCH,
        Object.assign(
            {},
            this._card
        )
    );
  }

  _handleWillWatchClick() {
    this._cardDataChange(
        UpdatePopup.POPUP_AT_ALL,
        UpdatedVersion.MINOR,
        Object.assign(
            {},
            this._card,
            {watchPlan: !this._card.watchPlan}
        )
    );
  }

  _handleWatchedClick() {
    this._cardDataChange(
        UpdatePopup.POPUP_AT_ALL,
        UpdatedVersion.MINOR,
        Object.assign(
            {},
            this._card,
            {hasWatched: !this._card.hasWatched}
        )
    );
  }

  _handleFavoriteClick() {
    this._cardDataChange(
        UpdatePopup.POPUP_AT_ALL,
        UpdatedVersion.MINOR,
        Object.assign(
            {},
            this._card,
            {isFavorite: !this._card.isFavorite}
        )
    );
  }
}

