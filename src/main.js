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
import Api from "./api.js";

const COMMON_CARD_COUNT = 22;
const AUTHORIZATION = `Basic dgfs234234fewlf443`;
const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;

const body = document.querySelector(`body`);
const siteHeaderElement = body.querySelector(`.header`);
const siteMainElement = body.querySelector(`.main`);
render(siteHeaderElement, new UserRank());
const menu = new Menu();
render(siteMainElement, menu);
const filterModel = new FilterModel();

const api = new Api(END_POINT, AUTHORIZATION);

api.getMovies().then((cards) => {
  console.log(cards);
  // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
  // а ещё на сервере используется snake_case, а у нас camelCase.
  // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
  // Есть вариант получше - паттерн "Адаптер"
});
const cards = new Array(COMMON_CARD_COUNT).fill().map(generateCard);
console.log(cards);
const cardsModel = new CardsModel();
cardsModel.setCards(cards); // возвращается копия cards в переменную this._cards. Ничего не возвращаем!
const innerMainPresenter = new InnerMain(siteMainElement, filterModel, cardsModel);
innerMainPresenter.renderInnerMain();

const footerStatistics = body.querySelector(`.footer__statistics`);
const text = footerStatistics.querySelector(`span`);
text.textContent = `${cardsModel.getCards().length}`;

const statistics = new Statistics(cardsModel.getCards());
render(siteMainElement, statistics);
statistics.getElement().classList.toggle(`visually-hidden`, true);

const mainNavigation = siteMainElement.querySelector(`.main-navigation`);
const filterPresenter = new FilterPresenter(mainNavigation, filterModel, cardsModel);
filterPresenter.init();

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.STATISTICS:
      innerMainPresenter.hide();
      statistics.getElement().classList.toggle(`visually-hidden`, false);
      menu.getElement()
        .querySelector(`.main-navigation__additional`)
        .classList.toggle(`main-navigation__additional--active`, true);

      [...menu.getElement().firstChild.children]
        .forEach((navigationItem) => {
          navigationItem.classList.toggle(`main-navigation__item--active`, false);
        });
      break;
    default:
      innerMainPresenter.show();
      statistics.getElement().classList.toggle(`visually-hidden`, true);
      menu.getElement()
        .querySelector(`.main-navigation__additional`)
        .classList.toggle(`main-navigation__additional--active`, false);
      break;
  }
};

menu.setMenuClickHandler(handleSiteMenuClick);
