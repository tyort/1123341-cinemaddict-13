import Observer from "../utils/observer.js";
import dayjs from "dayjs";

export default class Cards extends Observer {
  constructor() {
    super();
    this._cards = [];
  }

  static adaptToClient(card) {
    const adaptedCardToCoder = Object.assign(
        {},
        card,
        {
          allComments: [],
          dateOfView: dayjs(card.user_details.watching_date),
          description: card.film_info.description,
          director: card.film_info.director,
          duration: card.film_info.runtime,
          genres: card.film_info.genre,
          hasWatched: card.user_details.already_watched,
          id: card.id,
          idFavorite: card.user_details.favorite,
          poster: card.film_info.poster,
          actors: card.film_info.actors,
          ageLimit: card.film_info.age_rating,
          title: card.film_info.title,
          rating: card.film_info.total_rating,
          releaseCountry: card.film_info.release.release_country,
          releaseDate: new Date(card.film_info.release.date),
          watchPlan: card.user_details.watchlist,
          writers: card.film_info.writers
        }
    );

    delete adaptedCardToCoder.comments;
    delete adaptedCardToCoder.film_info;
    delete adaptedCardToCoder.user_details;

    console.log(adaptedCardToCoder);
    return adaptedCardToCoder;
  }

  setCards(cards) {
    this._cards = cards.slice();
  }

  getCards() {
    return this._cards;
  }

  changePopup(updatedVersion, updatedCard) {
    const index = this._cards.findIndex((card) => card.id === updatedCard.id);

    if (index !== -1) {
      this._cards = [
        ...this._cards.slice(0, index),
        updatedCard,
        ...this._cards.slice(index + 1)
      ];
    }

    this._notify(updatedVersion, updatedCard);
  }
}
