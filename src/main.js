import {createUserRankTemplate} from "./view/user-rank.js";
import {createMenuTemplate} from "./view/menu.js";
import {createSortTemplate} from "./view/sorting.js";
import {createAllMoviesTemplate} from "./view/movies-all.js";
import {createMovieCardTemplate} from "./view/movie-card.js";
// import {createMovieEditTemplate} from "./view/movie-edit.js";
import {createShowMoreTemplate} from "./view/show-more.js";
import {generateCard} from "./mock/card.js";
import {generateFilter} from "./mock/filter.js";

const EXTRA_CARD_COUNT = 2;
const COMMON_CARD_COUNT = 22;
const CARD_COUNT_STEP = 5;

const cards = new Array(COMMON_CARD_COUNT).fill().map(generateCard);
const filters = generateFilter(cards);

const body = document.querySelector(`body`);
const siteHeaderElement = body.querySelector(`.header`);
const siteMainElement = body.querySelector(`.main`);

render(siteHeaderElement, createUserRankTemplate());
render(siteMainElement, createMenuTemplate(filters));
render(siteMainElement, createSortTemplate());
render(siteMainElement, createAllMoviesTemplate());

const films = siteMainElement.querySelector(`.films`);
const filmsLists = films.querySelectorAll(`.films-list`);

filmsLists.forEach((list, index) => {
  const container = list.querySelector(`.films-list__container`);
  const count = index === 0 ? COMMON_CARD_COUNT : EXTRA_CARD_COUNT;

  // if (index === 0) {
  //   render(container, createMovieEditTemplate(cards[0]));
  // }

  for (let i = 0; i < count; i++) {
    render(container, createMovieCardTemplate(cards[i]));
  }
});

if (cards.length > CARD_COUNT_STEP) {
  render(filmsLists[0], createShowMoreTemplate());
  const showMoreButton = siteMainElement.querySelector(`.films-list__show-more`);

  showMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    alert(`Works!`);
  });
}

function render(container, template, place = `beforeend`) {
  container.insertAdjacentHTML(place, template);
}

