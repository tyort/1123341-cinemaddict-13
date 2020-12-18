import Abstract from "./abstract";

export default class Smart extends Abstract {
  constructor() {
    super();
    this._parsedCard = {};
  }

  // usersUpdate - это объект с нужными свойствами
  updateParsedCard(usersUpdate, justDataUpdating) {
    if (!usersUpdate) {
      return;
    }

    this._parsedCard = Object.assign(
        {},
        this._parsedCard,
        usersUpdate
    );

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: resetHandlers`);
  }
}
