import dayjs from "dayjs";
import he from "he";
import AbstractSmart from "./abstract-smart.js";
import {allEmojies} from "../const";
import {generateDuration, generateRecordDay} from "../utils/project-tools.js";
import {nanoid} from "nanoid";

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

const createCommentsTemplate = (comments) => {
  return comments
    .map((comment) => {
      if (comment.hasOwnProperty(`id`)) {
        const parsedDate = generateRecordDay(comment.date);

        return `<li id="user-id${comment.id}" class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img data-emoji="${comment.emotion}" src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
          </span>
          <div>
            <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${comment.author}</span>
              <span class="film-details__comment-day">${parsedDate}</span>
              <button class="film-details__comment-delete" ${comment.isDisabled ? `disabled` : ``}>
                ${comment.isDeletingComment ? `For deleting...` : `Delete`}
              </button>
            </p>
          </div>
        </li>`;
      }

      return ``;
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

const createGenresTemplate = (genres) => {
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
    allComments,
    director,
    actors,
    writers,
    releaseCountry
  } = card;

  const date = dayjs(releaseDate).format(`D MMMM YYYY`);
  const comments = createCommentsTemplate(allComments);
  const emojies = createEmojiesTemplate(allEmojies);
  const actualGenres = createGenresTemplate(genres);
  const parsedDuration = generateDuration(duration);

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./${image}" alt="${title}">

            <p class="film-details__age">${ageLimit}+</p>
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
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${date}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${parsedDuration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${releaseCountry}</td>
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
    this.parseCardToData = this.parseCardToData.bind(this);
    this._parsedCard = this.parseCardToData(card); // уже при первой загрузке получаем распарсенные данные
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._willWatchClickHandler = this._willWatchClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._enterKeydownHandler = this._enterKeydownHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this.parseDataToCard = this.parseDataToCard.bind(this);
    this._setInnerHandlers();
  }

  parseCardToData(card) {
    return Object.assign(
        {},
        card,
        {
          commentsSum: card.allComments.length,
          allComments: card.allComments
            .map((user) => Object.assign(
                {},
                user,
                {isDeletingComment: false, isDisabled: false}
            ))
        }
    );
  }

  parseDataToCard() {
    const commentators = this._parsedCard.allComments
      .filter((commentator) => commentator.isDeletingComment === false);

    this._parsedCard = Object.assign(
        {},
        this._parsedCard,
        {allComments: commentators}
    );

    this._parsedCard.allComments.forEach((user) => {
      delete user.isDeletingComment;
      delete user.isDisabled;
    });

    delete this._parsedCard.commentsSum;
    return this._parsedCard;
  }

  getTemplate() {
    return createMovieEditTemplate(this._parsedCard);
  }

  reset(card) {
    this.updateParsedCard(this.parseCardToData(card));
  }

  _emojiClickHandler(evt) { // внутренний хэндлер
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

  _enterKeydownHandler(evt) { // внутренний хэндлер
    if (evt.keyCode === 13 && !evt.shiftKey) { // когда просто нажимаем enter
      const commentPattern = this.getElement().querySelector(`.film-details__new-comment`);
      const child = commentPattern.firstElementChild;
      const img = child.querySelector(`img`);

      if (this.getElement().querySelector(`textarea`).value !== `` && img !== null) {
        const newComment = {
          id: nanoid(5),
          comment: this.getElement().querySelector(`textarea`).value,
          author: `Noname`,
          emotion: img.dataset.emoji,
          date: dayjs(new Date()).utc().format(),
          isDeletingComment: false,
          isDisabled: false
        };

        // this.updateParsedCard(this._parsedCard);
        // не учтет новое количество комментариев
        // this.updateParsedCard(this.parseCardToData(this._parsedCard)); !!! НЕ СТИРАТЬ
        // ПОЧЕМУ НЕ РАБОТАЕТ ВАРИАНТ ВЫШЕ!!!!
        // НЕЛЬЗЯ ЗДЕСЬ ИЗМЕНЯТЬ САМУ ПЕРЕМЕННУЮ ВОТ ТАК this._parsedCard.allComments.push
        this.updateParsedCard({
          allComments: [...this._parsedCard.allComments, newComment],
          commentsSum: this._parsedCard.allComments.length + 1
        });

        this.getElement().scrollTo(0, this.getElement().scrollHeight);
      }
    }
  }

  _deleteClickHandler(evt) { // внутренний хэндлер
    if (evt.target.className === `film-details__comment-delete`) {
      const index = this._parsedCard.allComments.findIndex((user) => {
        const userId = `${evt.target.parentElement.parentElement.parentElement.id.slice(7)}`;
        return user.id === userId;
      });

      const userForDelete = Object.assign(
          {},
          this._parsedCard.allComments[index],
          {
            isDeletingComment: true,
            isDisabled: true
          }
      );

      this.updateParsedCard({
        allComments: [
          ...this._parsedCard.allComments.slice(0, index),
          userForDelete,
          ...this._parsedCard.allComments.slice(index + 1)
        ]
      });

      this.getElement().scrollTo(0, this.getElement().scrollHeight);
    }
  }


  _willWatchClickHandler(evt) {
    evt.preventDefault();
    this.updateParsedCard({
      watchPlan: !this._parsedCard.watchPlan
    });
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this.updateParsedCard({
      hasWatched: !this._parsedCard.hasWatched,
      dateOfView: !this._parsedCard.hasWatched
        ? dayjs(new Date())
        : null
    });
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this.updateParsedCard({
      isFavorite: !this._parsedCard.isFavorite,
    });
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseClickHandler(this._handler.cardClick);
  }

  _setInnerHandlers() {
    this.getElement().addEventListener(`click`, this._emojiClickHandler);
    this.getElement().querySelector(`textarea`).addEventListener(`keydown`, this._enterKeydownHandler);
    this.getElement().addEventListener(`click`, this._deleteClickHandler);
    this.getElement().querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, this._willWatchClickHandler);
    this.getElement().querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, this._watchedClickHandler);
    this.getElement().querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, this._favoriteClickHandler);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._handler.cardClick(evt);
  }

  setCloseClickHandler(exactFormula) {
    this._handler.cardClick = exactFormula;
    const closeButton = this.getElement().querySelector(`.film-details__close-btn`);
    closeButton.addEventListener(`click`, this._closeClickHandler);
  }
}
