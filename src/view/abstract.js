import {createElement} from "../utils/view-tools.js";

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error(`Can't instantiate Abstract, only concrete one.`);
    }

    this._element = null;
    this._handler = {};
  }

  getTemplate() { // метод создает строковый шаблон, а ниже превращает в DOM-элемент
    throw new Error(`Abstract method not implemented: getTemplate`);
  }

  // метод превращает полученную строку сверху в DOM-элемент
  // т.е. экземпляр.getElement() === querySelector(`класс экземпляра`)
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  shake(callback) {
    this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = ``;
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
