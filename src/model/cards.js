import Observer from "../utils/observer.js";

export default class Cards extends Observer {
  constructor() {
    super();
    this._cardsGroup = [];
  }

  setCards(cards) {
    this._cardsGroup = cards.slice();
  }

  getCards() {
    return this._cardsGroup;
  }

  changePopup(updatedVersion, updatedCard) {
    const index = this._cardsGroup.findIndex((card) => card.id === updatedCard.id);

    if (index !== -1) {
      this._cardsGroup = [
        ...this._cardsGroup.slice(0, index),
        updatedCard,
        ...this._cardsGroup.slice(index + 1)
      ];
    }

    this._notify(updatedVersion, updatedCard);
  }
}
