import UserRank from "./view/user-rank.js";
import Menu from "./view/menu.js";
import Statistics from "./view/statistics.js";
import InnerMain from "./presenter/main-inside.js";
import FilterPresenter from "./presenter/filter.js";
import CardsModel from "./model/cards.js";
import FilterModel from "./model/filter.js";
import {render} from "./utils/view-tools.js";
import {UpdatedVersion, MenuItem} from "./const";
import Api from "./api/api.js";
import Provider from "./api/provider.js";
import Store from "./api/store.js";

const AUTHORIZATION = `Basic s2fewldfjh4`;
const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v13`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
let statistics = null;

const body = document.querySelector(`body`);
const siteHeaderElement = body.querySelector(`.header`);
const siteMainElement = body.querySelector(`.main`);
render(siteHeaderElement, new UserRank());
const menu = new Menu();
render(siteMainElement, menu);
const filterModel = new FilterModel();

const api = new Api(END_POINT, AUTHORIZATION);

// создаем хранилище в LocalStorage
const store = new Store(STORE_NAME, window.localStorage);

// посредник api & store
const apiWithProvider = new Provider(api, store);

const cardsModel = new CardsModel();
const innerMainPresenter = new InnerMain(siteMainElement, filterModel, cardsModel, apiWithProvider);
innerMainPresenter.renderInnerMain();

const mainNavigation = siteMainElement.querySelector(`.main-navigation`);
const filterPresenter = new FilterPresenter(mainNavigation, filterModel, cardsModel);

apiWithProvider.getMovies()
  .then((cards) => {
    cardsModel.setCards(UpdatedVersion.INIT, cards);
    menu.setMenuClickHandler(handleSiteMenuClick);
    filterPresenter.init();
    statistics = new Statistics(cardsModel.getCards());
    const footerStatistics = body.querySelector(`.footer__statistics`);
    const text = footerStatistics.querySelector(`span`);
    text.textContent = `${cardsModel.getCards().length}`;
  })
  .catch(() => {
    cardsModel.setCards(UpdatedVersion.INIT, []);
    menu.setMenuClickHandler(handleSiteMenuClick);
    filterPresenter.init();
    statistics = new Statistics(cardsModel.getCards());
    const footerStatistics = body.querySelector(`.footer__statistics`);
    const text = footerStatistics.querySelector(`span`);
    text.textContent = `${cardsModel.getCards().length}`;
  });

// в офлайне грузит саму страницу
// НЕ ЗАГРУЖАЕТ карточки фильмов
// "Трясет" попап, но не изменяет данные
// window.addEventListener(`load`, () => {
//   navigator.serviceWorker.register(`/sw.js`);
// });

// в DOM-дереве добавляет к титулу online
window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

// в DOM-дереве добавляет к титулу offline
window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

function handleSiteMenuClick(menuItem) {
  switch (menuItem) {
    case MenuItem.STATISTICS:
      innerMainPresenter.hide();
      render(siteMainElement, statistics);
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
}
