import dayjs from "dayjs";
import AbstractSmart from "./abstract-smart.js";
import {allEmojies} from "../const";

const BLANK_CARD = {
  poster: ``,
  title: ``,
  rating: ``,
  releaseDate: null,
  duration: ``,
  genres: [],
  description: ``,
  watchPlan: false,
  hasWatched: false,
  isFavorite: false,
  ageLimit: ``,
  allComments: []
};

const createCommentsTemplate = (count, comments) => {
  return new Array(count)
    .fill()
    .map((_comment, index) => {
      return `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img data-emoji="${comments[index].emoji}" src="./images/emoji/${comments[index].emoji}.png" width="55" height="55" alt="emoji-${comments[index].emoji}">
        </span>
        <div>
          <p class="film-details__comment-text">${comments[index].text}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${comments[index].author}</span>
            <span class="film-details__comment-day">${comments[index].day}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>`;
    })
    .join(``);
};

const createEmojiesTemplate = (emojies) => {
  return emojies
    .map((emoji) => {
      return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
        <label class="film-details__emoji-label" for="emoji-${emoji}">
          <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji" data-emoji="${emoji}">
        </label>`;
    })
    .join(``);
};

const generateGenresTemplate = (genres) => {
  return genres
    .map((genre) => {
      return `<span class="film-details__genre">${genre}</span>`;
    })
    .join(``);
};

const createMovieEditTemplate = (card = {}) => {
  const {
    poster: image,
    title,
    rating,
    releaseDate,
    duration,
    description,
    commentsSum,
    ageLimit,
    genres,
    watchPlan,
    hasWatched,
    isFavorite,
    allComments
  } = card;

  const date = dayjs(releaseDate).format(`D MMMM YYYY`);
  const comments = createCommentsTemplate(commentsSum, allComments);
  const emojies = createEmojiesTemplate(allEmojies);
  const actualGenres = generateGenresTemplate(genres);

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./images/posters/${image}" alt="${title}">

            <p class="film-details__age">${ageLimit}</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${title}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">Anthony Mann</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">Anne Wigton, Heinz Herald, Richard Weil</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">Erich von Stroheim, Mary Beth Hughes, Dan Duryea</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${date}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${duration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">USA</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">${actualGenres}</td>
              </tr>
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchPlan ? `checked` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${hasWatched ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? `checked` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsSum}</span></h3>

          <ul class="film-details__comments-list">
            ${comments}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label"></div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              ${emojies}
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class MovieEdit extends AbstractSmart {
  constructor(card = BLANK_CARD) {
    super();
    this._parsedCard = MovieEdit.parseCardToData(card); // уже при первой загрузке получаем распарсенные данные
    this._handler = {
      cardClick: null,
      willWatchClick: null,
      watchedClick: null,
      favoriteClick: null,
      formSubmit: null
    };
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._willWatchClickHandler = this._willWatchClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._enterKeydownHandler = this._enterKeydownHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._setInnerHandlers();
  }

  get currentCard() {
    return this._parsedCard;
  }

  set currentCard(card) {
    this._parsedCard = MovieEdit.parseCardToData(card);
  }

  // можно добавить к исходным свойствам карточки новые свойства
  static parseCardToData(card) {
    return Object.assign(
        {},
        card,
        {
          isRatingGood: card.rating > 7, // ??????? измени или удали ???????
          isHated: !card.isFavorite, // ??????? измени или удали ???????
          commentsSum: card.allComments.length
        }
    );
  }

  static parseDataToCard(parsedCard) { //  ??????? для сохранения изменений карточки внесенных на сайте ???????
    parsedCard = Object.assign({}, parsedCard);
    parsedCard.isFavorite = parsedCard.isHated ? false : true;
    delete parsedCard.isRatingGood;
    delete parsedCard.isHated;
    delete parsedCard.commentsSum;
    return parsedCard;
  }

  getTemplate() {
    return createMovieEditTemplate(this._parsedCard);
  }

  _emojiClickHandler(evt) {
    evt.preventDefault();
    const parent = evt.target.parentElement;
    if (parent.className !== `film-details__emoji-label`) {
      return;
    }

    const emojiName = evt.target.dataset.emoji;
    const newComment = this.getElement().querySelector(`.film-details__new-comment`);
    newComment.firstElementChild.innerHTML = (
      `<img
        data-emoji="${emojiName}"
        src="./images/emoji/${emojiName}.png"
        width="55" height="55"
        alt="emoji-${emojiName}"
      >`
    );
  }

  _enterKeydownHandler(evt) {
    if (evt.keyCode === 13 && !evt.shiftKey) { // когда просто нажимаем enter
      const commentPattern = this.getElement().querySelector(`.film-details__new-comment`);
      const child = commentPattern.firstElementChild;
      const img = child.querySelector(`img`);

      if (this.getElement().querySelector(`textarea`).value !== `` && img !== null) {
        const comment = {
          text: this.getElement().querySelector(`textarea`).value,
          author: `Noname`,
          emoji: img.dataset.emoji,
          day: `today`
        };

        const allComments = this._parsedCard.allComments;
        allComments.push(comment);
        this._handler.formSubmit(MovieEdit.parseDataToCard(this._parsedCard));
      }
    }
  }

  _deleteClickHandler(evt) {
    if (evt.target.className === `film-details__comment-delete`) {
      const index = this._parsedCard.allComments.findIndex((user) => {
        return user.author === evt.target.parentElement.querySelector(`.film-details__comment-author`).textContent;
      });

      this._parsedCard.allComments = [
        ...this._parsedCard.allComments.slice(0, index),
        ...this._parsedCard.allComments.slice(index + 1)
      ];

      evt.target.parentElement.parentElement.parentElement.remove();
      this._handler.formSubmit(MovieEdit.parseDataToCard(this._parsedCard));
    }
  }

  _closeClickHandler(evt) {
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

  restoreHandlers() {
    this._setInnerHandlers();
  }

  _setInnerHandlers() {
    this.getElement().addEventListener(`click`, this._emojiClickHandler);
    this.getElement().querySelector(`textarea`).addEventListener(`keydown`, this._enterKeydownHandler);
    this.getElement().addEventListener(`click`, this._deleteClickHandler);
  }

  setCloseClickHandler(exactFormula) {
    this._handler.cardClick = exactFormula;
    const closeButton = this.getElement().querySelector(`.film-details__close-btn`);
    closeButton.addEventListener(`click`, this._closeClickHandler);
  }

  setWillWatchClickHandler(exactFormula) {
    this._handler.willWatchClick = exactFormula;
    this.getElement().querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, this._willWatchClickHandler);
  }

  setWatchedClickHandler(exactFormula) {
    this._handler.watchedClick = exactFormula;
    this.getElement().querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, this._watchedClickHandler);
  }

  setFavoriteClickHandler(exactFormula) {
    this._handler.favoriteClick = exactFormula;
    this.getElement().querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, this._favoriteClickHandler);
  }

  setFormSubmitHandler(exactFormula) {
    this._handler.formSubmit = exactFormula;
  }
}
