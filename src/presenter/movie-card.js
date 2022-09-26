import {render, removeExemplar, replace} from "../utils/view-tools";
import MovieCard from "../view/movie-card.js";
import {UpdateMovie, UpdatedVersion} from "../const.js";
import dayjs from "dayjs";

export default class CardPresenter {
  constructor(cardContainer, cardDataChange) {
    this._cardContainer = cardContainer;
    this._cardDataChange = cardDataChange;
    this._cardComponent = null;
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
        UpdateMovie.OPEN_POPUP,
        UpdatedVersion.PATCH,
        this._card
    );
  }

  _handleWillWatchClick() {
    this._cardDataChange(
        UpdateMovie.CARD_AT_ALL,
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
        UpdateMovie.CARD_AT_ALL,
        UpdatedVersion.MINOR,
        Object.assign(
            {},
            this._card,
            {hasWatched: !this._card.hasWatched},
            {dateOfView: !this._card.hasWatched
              ? dayjs(new Date())
              : null
            }
        )
    );
  }

  _handleFavoriteClick() {
    this._cardDataChange(
        UpdateMovie.CARD_AT_ALL,
        UpdatedVersion.MINOR,
        Object.assign(
            {},
            this._card,
            {isFavorite: !this._card.isFavorite}
        )
    );
  }
}

