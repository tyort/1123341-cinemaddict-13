import UserRank from "./view/user-rank.js";
import Menu from "./view/menu.js";
import Statistics from "./view/statistics.js";
import InnerMain from "./presenter/main-inside.js";
import FilterPresenter from "./presenter/filter.js";
import CardsModel from "./model/cards.js";
import FilterModel from "./model/filter.js";
import {generateCard} from "./mock/card.js";
import {render} from "./utils/view-tools.js";
import {MenuItem} from "./const";

const COMMON_CARD_COUNT = 22;

const body = document.querySelector(`body`);
const siteHeaderElement = body.querySelector(`.header`);
const siteMainElement = body.querySelector(`.main`);
render(siteHeaderElement, new UserRank());
const menu = new Menu();
render(siteMainElement, menu);
const filterModel = new FilterModel();

const cards = new Array(COMMON_CARD_COUNT).fill().map(generateCard);
const cardsModel = new CardsModel();
cardsModel.setCards(cards); // возвращается копия cards в переменную this._cards. Ничего не возвращаем!
const innerMainPresenter = new InnerMain(siteMainElement, filterModel, cardsModel);
innerMainPresenter.renderInnerMain();

const statistics = new Statistics(cardsModel.getCards());
render(siteMainElement, statistics);

const mainNavigation = siteMainElement.querySelector(`.main-navigation`);
const filterPresenter = new FilterPresenter(mainNavigation, filterModel, cardsModel);
filterPresenter.init();

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.STATISTICS:
      innerMainPresenter.clearInsideMain({resetRenderedCardsCount: false, resetSortType: false});
      break;
    default:
      innerMainPresenter.renderInnerMain();
      break;
  }
};

menu.setMenuClickHandler(handleSiteMenuClick);
