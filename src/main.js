import UserRank from "./view/user-rank.js";
import Menu from "./view/menu.js";
import InnerMain from "./presenter/main-inside.js";
import FilterPresenter from "./presenter/filter.js";
import CardsModel from "./model/cards.js";
import FilterModel from "./model/filter.js";
import {generateCard} from "./mock/card.js";
import {render} from "./utils/view-tools.js";

const COMMON_CARD_COUNT = 22;

const body = document.querySelector(`body`);
const siteHeaderElement = body.querySelector(`.header`);
const siteMainElement = body.querySelector(`.main`);

const cards = new Array(COMMON_CARD_COUNT).fill().map(generateCard);

const cardsModel = new CardsModel();
cardsModel.setCards(cards); // возвращается копия cards в переменную this._cards. Ничего не возвращаем!

const filterModel = new FilterModel();

const innerMainPresenter = new InnerMain(siteMainElement, filterModel, cardsModel);

render(siteHeaderElement, new UserRank());
render(siteMainElement, new Menu());
const mainNavigation = siteMainElement.querySelector(`.main-navigation`);

const filterPresenter = new FilterPresenter(mainNavigation, filterModel, cardsModel);

innerMainPresenter.aboveRenderInnerMain();
filterPresenter.init();

