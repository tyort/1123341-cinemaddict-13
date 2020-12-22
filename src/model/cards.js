import Observer from "../utils/observer.js";

export default class Cards extends Observer {
  constructor() {
    super();
    this._cards = [];
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
