import CardsModel from "../model/cards.js";
import {isOnline} from "../utils/common-tools.js";

// должны быть такие же методы как у api !!!
export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getMovies() {
    if (isOnline()) {
      return this._api.getMovies()
        .then((cards) => {
          const items = createStoreStructure(cards.map(CardsModel.adaptToServer));

          // помещаем в хранилище карточки фильмов
          this._store.setItems(items);

          return cards;
        });
    }

    // НИЖЕ только в режиме ОФФЛАЙН
    // Из {id: {сам объект}, id: {сам объект}}
    // получаем [{сам объект}, {сам объект}]
    const storeCards = Object.values(this._store.getItems());

    // мы должны вернуть промис, поэтому вызываем статичный метод
    return Promise.resolve(storeCards.map(CardsModel.adaptToClient));
  }

  getComments(card) {
    if (isOnline()) {
      return this._api.getComments(card)
        .then((comments) => {
          this._store.setCardComments(card, createStoreStructure(comments));
          return comments;
        });
    }

    const storeComments = Object.values(this._store.getCardComments(card));
    return Promise.resolve(storeComments.slice());
  }

  deleteComment(card, user) {
    if (isOnline()) {
      return this._api.deleteComment(user)
        .then(() => this._store.deleteComment(user.id, `comments-for-card-id${card.id}`));
    }

    return Promise.reject(new Error(`Delete comment failed`));
  }

  addComment(card, user) {
    if (isOnline()) {
      return this._api.addComment(card, user)
        .then((updatedCard) => {
          this._store.setCardComments(card, createStoreStructure(updatedCard.comments));
          return updatedCard;
        });
    }

    return Promise.reject(new Error(`Add comment failed`));
  }

  updateMovie(card) {
    if (isOnline()) {
      return this._api.updateMovie(card)
        .then((updatedCard) => {
          this._store.setItem(updatedCard.id, CardsModel.adaptToServer(updatedCard));
          return updatedCard;
        });
    }

    this._store.setItem(card.id, CardsModel.adaptToServer(Object.assign({}, card)));
    return Promise.resolve(card);
  }


  // поможет в режиме offline загрузить изменения в LocalStorage
  // а когда появится сеть поможет передать информацию на сервер
  sync() {
    if (isOnline()) {
      const storeTasks = Object.values(this._store.getItems());

      return this._api.sync(storeTasks)
        .then((response) => {
          this._store.setItems(response.updated);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}

// массив объектов превращает в объект с объектами;
// это необходимо для LocalStorage
// вместо [{сам объект}, {сам объект}];
// {id: {сам объект}, id: {сам объект}};
function createStoreStructure(items) {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
}

