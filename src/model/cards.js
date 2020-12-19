import Observer from "../utils/observer.js";
import {compareRating, compareCommentsCount} from "../utils/project-tools";

export default class Cards extends Observer {
  constructor() {
    super();
    this._cardsGroup = {
      main: [],
      rated: [],
      commented: [],
      default: []
    };
  }

  setCards(cards) {
    this._cardsGroup.main = cards.slice();
    this._cardsGroup.rated = cards.slice().sort(compareRating);
    this._cardsGroup.commented = cards.slice().sort(compareCommentsCount);
  }

  getCards() {
    return this._cardsGroup;
  }

  changePopup(updatedVersion, updatedCard) {
    const indexMainCards = this._cardsGroup.main.findIndex((card) => card.id === updatedCard.id);
    const indexRatedCards = this._cardsGroup.rated.findIndex((card) => card.id === updatedCard.id);
    const indexCommentedCards = this._cardsGroup.commented.findIndex((card) => card.id === updatedCard.id);

    if (indexMainCards !== -1) {
      this._cardsGroup.main = [
        ...this._cardsGroup.main.slice(0, indexMainCards),
        updatedCard,
        ...this._cardsGroup.main.slice(indexMainCards + 1)
      ];
    }

    if (indexRatedCards !== -1) {
      this._cardsGroup.rated = [
        ...this._cardsGroup.rated.slice(0, indexRatedCards),
        updatedCard,
        ...this._cardsGroup.rated.slice(indexRatedCards + 1)
      ];
    }

    if (indexCommentedCards !== -1) {
      this._cardsGroup.commented = [
        ...this._cardsGroup.commented.slice(0, indexCommentedCards),
        updatedCard,
        ...this._cardsGroup.commented.slice(indexCommentedCards + 1)
      ];
    }

    this._notify(updatedVersion, updatedCard);
  }
}
