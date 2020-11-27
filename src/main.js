import UserRank from "./view/user-rank.js";
import Menu from "./view/menu.js";
import Sort from "./view/sorting.js";
import AllMovies from "./view/movies-all.js";
import MovieCard from "./view/movie-card.js";
import MovieEdit from "./view/movie-edit.js";
import ShowMore from "./view/show-more.js";
import {generateCard} from "./mock/card.js";
import {generateFilter} from "./mock/filter.js";
import {render} from "./utils.js";

const EXTRA_CARD_COUNT = 2;
const COMMON_CARD_COUNT = 22;
const CARD_COUNT_STEP = 5;

const cards = new Array(COMMON_CARD_COUNT).fill().map(generateCard);
const filters = generateFilter(cards);

const body = document.querySelector(`body`);
const siteHeaderElement = body.querySelector(`.header`);
const siteMainElement = body.querySelector(`.main`);

render(siteHeaderElement, new UserRank().getElement());
render(siteMainElement, new Menu(filters).getElement());
render(siteMainElement, new Sort().getElement());

const films = new AllMovies();
render(siteMainElement, films.getElement());

const filmsLists = films.getElement().querySelectorAll(`.films-list`);

filmsLists.forEach((list, index) => {
  const container = list.querySelector(`.films-list__container`);
  const count = index === 0 ? CARD_COUNT_STEP : EXTRA_CARD_COUNT;

  for (let i = 0; i < Math.min(cards.length, count); i++) {
    renderCard(container, cards[i]);
  }
});

if (cards.length > CARD_COUNT_STEP) {
  let renderedCardsCount = CARD_COUNT_STEP;

  const showMoreButton = new ShowMore();
  render(filmsLists[0], showMoreButton.getElement());

  showMoreButton.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();
    const container = films.getElement().querySelector(`.films-list`).querySelector(`.films-list__container`);
    cards
      .slice(renderedCardsCount, renderedCardsCount + CARD_COUNT_STEP)
      .forEach((card) => renderCard(container, card));

    renderedCardsCount += CARD_COUNT_STEP;

    if (renderedCardsCount >= cards.length) {
      showMoreButton.getElement().remove(); // удаляем со свизуализируемого DOM-дерева
      showMoreButton.removeElement();
    }
  });
}


function renderCard(container, card) {
  const cardComponent = new MovieCard(card);
  const cardEditComponent = new MovieEdit(card);

  render(container, cardComponent.getElement());

  const showPopup = () => {
    body.appendChild(cardEditComponent.getElement());
  };

  const deletePopup = () => {
    body.removeChild(cardEditComponent.getElement());
  };

  Array.of(`.film-card__poster`, `.film-card__title`, `.film-card__comments`)
  .forEach((elementInCard) => {
    cardComponent.getElement().querySelector(elementInCard).addEventListener(`click`, () => {
      showPopup();
      body.classList.toggle(`hide-overflow`, true);
    });
  });

  cardEditComponent.getElement().querySelector(`.film-details__close-btn`)
    .addEventListener(`click`, () => {
      deletePopup();
      body.classList.toggle(`hide-overflow`, false);
    });
}


