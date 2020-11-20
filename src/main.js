import {createUserRankTemplate} from "./view/user-rank.js";
import {createMenuTemplate} from "./view/menu.js";
import {createSortTemplate} from "./view/sorting.js";
import {createAllMoviesTemplate} from "./view/movies-all.js";
import {createMovieCardTemplate} from "./view/movie-card.js";
import {createShowMoreTemplate} from "./view/show-more.js";
import "./mock/card.js";

const UPCOMING_CARD_COUNT = 5;
const EXTRA_CARD_COUNT = 2;

const body = document.querySelector(`body`);
const siteHeaderElement = body.querySelector(`.header`);
const siteMainElement = body.querySelector(`.main`);

render(siteHeaderElement, createUserRankTemplate());
render(siteMainElement, createMenuTemplate());
render(siteMainElement, createSortTemplate());
render(siteMainElement, createAllMoviesTemplate());

const films = siteMainElement.querySelector(`.films`);
const filmsLists = films.querySelectorAll(`.films-list`);

filmsLists.forEach((list, index) => {
  const container = list.querySelector(`.films-list__container`);
  const count = index === 0 ? UPCOMING_CARD_COUNT : EXTRA_CARD_COUNT;
  renderCard(container, createMovieCardTemplate(), count);
});

render(filmsLists[0], createShowMoreTemplate());

function render(container, template, place = `beforeend`) {
  container.insertAdjacentHTML(place, template);
}

function renderCard(container, template, count) {
  for (let i = 0; i < count; i++) {
    render(container, template);
  }
}
