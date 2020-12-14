import {render, removeExemplar, replace} from "../utils/view-tools";
import MovieEdit from "../view/movie-edit.js";
import MovieCard from "../view/movie-card.js";
const body = document.querySelector(`body`);

export default class CardPresenter {
  constructor(cardContainer, cardContainers, cardChangeAtAll, deleteAllPopups) {
    this._cardContainer = cardContainer;
    this._cardContainers = cardContainers;
    this._cardChangeAtAll = cardChangeAtAll;
    this._deleteAllPopups = deleteAllPopups;
    this._cardComponent = null;
    this._cardEditComponent = null;
    this._handleCardClick = this._handleCardClick.bind(this);
    this._handleWillWatchClick = this._handleWillWatchClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  // создается экземпляр компонента карты с эксклюзивными данными
  // запихиваем в него обработчик
  // рисуем представление
  // ------------------------------------------------------------
  // также перезаписываем обновленную карту и попап
  createTotally(card) {
    this._card = card;

    const oldCard = this._cardComponent; // либо старая карта, либо ничего
    const oldEdit = this._cardEditComponent;

    this._cardComponent = new MovieCard(this._card);
    this._cardEditComponent = new MovieEdit(this._card);

    this._cardComponent.setCardClickHandler(this._handleCardClick);
    this._cardComponent.setWillWatchClickHandler(this._handleWillWatchClick);
    this._cardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._cardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._cardEditComponent.setCloseClickHandler(this._handleCloseClick);
    this._cardEditComponent.setWillWatchClickHandler(this._handleWillWatchClick);
    this._cardEditComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._cardEditComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._cardEditComponent.setFormSubmitHandler(this._handleFormSubmit);

    if (oldCard === null || oldEdit === null) {
      render(this._cardContainer, this._cardComponent);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this._cardContainer.contains(oldCard.getElement())) {
      replace(this._cardComponent, oldCard);
    }

    if (body.contains(oldEdit.getElement())) {
      replace(this._cardEditComponent, oldEdit);
    }

    removeExemplar(oldCard);
    removeExemplar(oldEdit);
  }

  destroy() {
    removeExemplar(this._cardComponent);
    removeExemplar(this._cardEditComponent);
  }

  _handleCardClick() {
    this._deleteAllPopups();
    render(body, this._cardEditComponent);
    body.classList.toggle(`hide-overflow`, true);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _handleCloseClick() {
    this._cardEditComponent.getElement().remove();
    body.classList.toggle(`hide-overflow`, false);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  deletePopup() {
    this._handleCloseClick();
  }

  _handleWillWatchClick() {
    this._cardChangeAtAll(
        Object.assign(
            {},
            this._card,
            {watchPlan: !this._card.watchPlan}
        )
    );
  }

  _handleWatchedClick() {
    this._cardChangeAtAll(
        Object.assign(
            {},
            this._card,
            {hasWatched: !this._card.hasWatched}
        )
    );
  }

  _handleFavoriteClick() {
    this._cardChangeAtAll(
        Object.assign(
            {},
            this._card,
            {isFavorite: !this._card.isFavorite}
        )
    );
  }


  // в отличие от this_handleFavoriteClick (см.выше)
  // мы передаем новые данные карточки во вьюхе попапа
  // а данные обновляются также у карточки!!!
  _handleFormSubmit(card) {
    this._cardChangeAtAll(card);
    this._cardEditComponent.getElement()
      .scrollTo(0, this._cardEditComponent.getElement().scrollHeight);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._handleCloseClick();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
