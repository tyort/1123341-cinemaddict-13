import {createUserRankTemplate} from "./view/user-rank.js";
import Menu from "./view/menu.js";
import {createSortTemplate} from "./view/sorting.js";
import {createAllMoviesTemplate} from "./view/movies-all.js";
import {createMovieCardTemplate} from "./view/movie-card.js";
// import {createMovieEditTemplate} from "./view/movie-edit.js";
import {createShowMoreTemplate} from "./view/show-more.js";
import {generateCard} from "./mock/card.js";
import {generateFilter} from "./mock/filter.js";
import {renderTemplate, renderElement, RenderPosition} from "./utils.js";

const EXTRA_CARD_COUNT = 2;
const COMMON_CARD_COUNT = 22;
const CARD_COUNT_STEP = 5;

const cards = new Array(COMMON_CARD_COUNT).fill().map(generateCard);
const filters = generateFilter(cards);

const body = document.querySelector(`body`);
const siteHeaderElement = body.querySelector(`.header`);
const siteMainElement = body.querySelector(`.main`);

renderTemplate(siteHeaderElement, createUserRankTemplate());
renderElement(siteMainElement, new Menu(filters).getElement());
renderTemplate(siteMainElement, createSortTemplate());
renderTemplate(siteMainElement, createAllMoviesTemplate());

const films = siteMainElement.querySelector(`.films`);
const filmsLists = films.querySelectorAll(`.films-list`);

filmsLists.forEach((list, index) => {
  const container = list.querySelector(`.films-list__container`);
  const count = index === 0 ? CARD_COUNT_STEP : EXTRA_CARD_COUNT;

  // if (index === 0) {
  //   renderTemplate(container, createMovieEditTemplate(cards[0]));
  // }

  for (let i = 0; i < Math.min(cards.length, count); i++) {
    renderTemplate(container, createMovieCardTemplate(cards[i]));
  }
});

if (cards.length > CARD_COUNT_STEP) {
  let renderedCardsCount = CARD_COUNT_STEP;
  renderTemplate(filmsLists[0], createShowMoreTemplate());
  const showMoreButton = siteMainElement.querySelector(`.films-list__show-more`);

  showMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    const container = films.querySelector(`.films-list`).querySelector(`.films-list__container`);
    cards
      .slice(renderedCardsCount, renderedCardsCount + CARD_COUNT_STEP)
      .forEach((card) => renderTemplate(container, createMovieCardTemplate(card)));

    renderedCardsCount += CARD_COUNT_STEP;

    if (renderedCardsCount >= cards.length) {
      showMoreButton.remove();
    }
  });
}

