import Observer from "../utils/observer.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export default class Cards extends Observer {
  constructor() {
    super();
    this._cards = [];
    this._comments = [];
  }

  static adaptToServer(card) {
    const adaptedCardToServer = {
      "comments": card.allComments,

      "film_info": {
        "actors": card.actors,
        "age_rating": card.ageLimit,
        "alternative_title": card.title,
        "description": card.description,
        "director": card.director,
        "genre": card.genres,
        "poster": card.poster,

        "release": {
          "date": dayjs(card.releaseDate).utc().format(),
          "release_country": card.releaseCountry
        },

        "runtime": card.duration,
        "title": card.title,
        "total_rating": card.rating,
        "writers": card.writers
      },

      "id": card.id,

      "user_details": {
        "already_watched": card.hasWatched,
        "favorite": card.isFavorite,
        "watching_date": card.hasWatched ? card.dateOfView.utc().format() : null,
        "watchlist": card.watchPlan
      }
    };

    return adaptedCardToServer;
  }

  static adaptToClient(card) {
    const adaptedCardToCoder = {
      allComments: card.comments,
      dateOfView: dayjs(card.user_details.watching_date),
      description: card.film_info.description,
      director: card.film_info.director,
      duration: card.film_info.runtime,
      genres: card.film_info.genre,
      hasWatched: card.user_details.already_watched,
      id: card.id,
      isFavorite: card.user_details.favorite,
      poster: card.film_info.poster,
      actors: card.film_info.actors,
      ageLimit: card.film_info.age_rating,
      title: card.film_info.title,
      rating: card.film_info.total_rating,
      releaseCountry: card.film_info.release.release_country,
      releaseDate: new Date(card.film_info.release.date),
      watchPlan: card.user_details.watchlist,
      writers: card.film_info.writers
    };

    return adaptedCardToCoder;
  }

  setCards(updatedVersion, cards) {
    this._cards = cards.slice();
    this._notify(updatedVersion);
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getCards() {
    return this._cards;
  }

  getComments() {
    return this._comments;
  }

  openPopup(updatedVersion, updatedCard) {
    const parsedUpdatedCard = Object.assign(
        {},
        updatedCard,
        {allComments: this._comments}
    );
    this._notify(updatedVersion, parsedUpdatedCard);
  }


  changePopup(updatedVersion, updatedCard) {
    const index = this._cards.findIndex((card) => card.id === updatedCard.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting task`);
    }

    this._cards = [
      ...this._cards.slice(0, index),
      updatedCard,
      ...this._cards.slice(index + 1)
    ];

    this._notify(updatedVersion, updatedCard);
  }
}
