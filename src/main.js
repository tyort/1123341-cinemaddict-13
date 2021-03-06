import UserRank from "./view/user-rank.js";
import Menu from "./view/menu.js";
import InnerMain from "./presenter/main-inside.js";
import {generateCard} from "./mock/card.js";
import {generateFilter} from "./mock/filter.js";
import {render} from "./utils/view-tools.js";

const COMMON_CARD_COUNT = 22;

const body = document.querySelector(`body`);
const siteHeaderElement = body.querySelector(`.header`);
const siteMainElement = body.querySelector(`.main`);

const innerMainPresenter = new InnerMain();
const cards = new Array(COMMON_CARD_COUNT).fill().map(generateCard);
const filters = generateFilter(cards);

render(siteHeaderElement, new UserRank());
render(siteMainElement, new Menu(filters));
innerMainPresenter.createTotally(cards);


