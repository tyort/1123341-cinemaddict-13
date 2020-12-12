import dayjs from "dayjs";
import Abstract from "./abstract.js";

const createMovieCardTemplate = (card) => {
  const {
    poster,
    title,
    rating,
    releaseDate,
    duration,
    genres,
    description,
    watchPlan,
    hasWatched,
    isFavorite,
    allComments
  } = card;

  const year = dayjs(releaseDate).format(`YYYY`);


  const planClassName = watchPlan ? `film-card__controls-item--active` : ``;
  const watchedClassName = hasWatched ? `film-card__controls-item--active` : ``;
  const favoriteClassName = isFavorite ? `film-card__controls-item--active` : ``;

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${year}</span>
      <span class="film-card__duration">${duration}</span>
      <span class="film-card__genre">${genres[0]}</span>
    </p>
    <img src="./images/posters/${poster}" alt="${title}" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <a class="film-card__comments">${allComments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${planClassName}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class MovieCard extends Abstract {
  constructor(card) {
    super();
    this._card = card;
    this._handler = {
      cardClick: null,
      willWatchClick: null,
      watchedClick: null,
      favoriteClick: null
    };
    this._cardClickHandler = this._cardClickHandler.bind(this);
    this._willWatchClickHandler = this._willWatchClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createMovieCardTemplate(this._card);
  }

  _cardClickHandler(evt) {
    evt.preventDefault();
    this._handler.cardClick();
  }

  _willWatchClickHandler(evt) {
    evt.preventDefault();
    this._handler.willWatchClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._handler.watchedClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._handler.favoriteClick();
  }

  setCardClickHandler(exactFormula) {
    this._handler.cardClick = exactFormula;

    Array.of(`.film-card__poster`, `.film-card__title`, `.film-card__comments`)
    .forEach((elementInCard) => {
      this.getElement().querySelector(elementInCard).addEventListener(`click`, this._cardClickHandler);
    });
  }

  setWillWatchClickHandler(exactFormula) {
    this._handler.willWatchClick = exactFormula;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, this._willWatchClickHandler);
  }

  setWatchedClickHandler(exactFormula) {
    this._handler.watchedClick = exactFormula;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, this._watchedClickHandler);
  }

  setFavoriteClickHandler(exactFormula) {
    this._handler.favoriteClick = exactFormula;
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, this._favoriteClickHandler);
  }
}
