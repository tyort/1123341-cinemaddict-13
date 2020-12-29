import {isOnline, toast} from "../utils/common-tools.js";

const COMMENTS_STORE_PREFIX = `comments-for-card-id`;

export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getItems() { // получаем содержимое хранилища по ключу
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(items) {
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(items)
    );
  }

  getCardComments(card) {
    try {
      if (!isOnline() && !Object.keys(localStorage).some((key) => key === `${COMMENTS_STORE_PREFIX}${card.id}`)) {
        return toast(`You can't edit popup offline`);
      }

      return JSON.parse(this._storage.getItem(`${COMMENTS_STORE_PREFIX}${card.id}`)) || {};

    } catch (err) {
      return toast(`${err}`);
    }
  }

  setCardComments(card, comments) {
    this._storage.setItem(
        `${COMMENTS_STORE_PREFIX}${card.id}`,
        JSON.stringify(comments)
    );
  }

  // не учавствует в getMovies
  setItem(key, value) {
    const store = this.getItems();

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {
              [key]: value
            })
        )
    );
  }

  removeItem(key) {
    const store = this.getItems();

    delete store[key];

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(store)
    );
  }
}
