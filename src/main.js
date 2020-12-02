import UserRank from "./view/user-rank.js";
import Menu from "./view/menu.js";
import Sort from "./view/sorting.js";
import AllMovies from "./view/movies-all.js";
import NoMovies from "./view/no-movies.js";
import MovieCard from "./view/movie-card.js";
import MovieEdit from "./view/movie-edit.js";
import ShowMore from "./view/show-more.js";
import {generateCard} from "./mock/card.js";
import {generateFilter} from "./mock/filter.js";
import {render, removeExemplar} from "./utils/view-tools.js";

const EXTRA_CARD_COUNT = 2;
const COMMON_CARD_COUNT = 22;
const CARD_COUNT_STEP = 5;

const cards = new Array(COMMON_CARD_COUNT).fill().map(generateCard);
const filters = generateFilter(cards);

const body = document.querySelector(`body`);
const siteHeaderElement = body.querySelector(`.header`);
const siteMainElement = body.querySelector(`.main`);

render(siteHeaderElement, new UserRank());
render(siteMainElement, new Menu(filters));
const cardEditComponent = new MovieEdit();
renderBoard(cards);


function renderBoard(boardCards) {
  if (boardCards.length === 0) {
    render(siteMainElement, new NoMovies());
    return;
  }

  render(siteMainElement, new Sort());
  const films = new AllMovies();
  render(siteMainElement, films);
  const filmsLists = films.getElement().querySelectorAll(`.films-list`);

  filmsLists.forEach((list, index) => {
    const container = list.querySelector(`.films-list__container`);
    const count = index === 0 ? CARD_COUNT_STEP : EXTRA_CARD_COUNT;
    boardCards
      .slice(0, Math.min(boardCards.length, count))
      .forEach((card) => renderCard(container, card));
  });

  if (boardCards.length > CARD_COUNT_STEP) {
    let renderedCardsCount = CARD_COUNT_STEP;

    const showMoreButton = new ShowMore();
    render(filmsLists[0], showMoreButton);

    showMoreButton.setClickHandler(() => {
      const container = films.getElement().querySelector(`.films-list`).querySelector(`.films-list__container`);
      boardCards
        .slice(renderedCardsCount, renderedCardsCount + CARD_COUNT_STEP)
        .forEach((card) => renderCard(container, card));

      renderedCardsCount += CARD_COUNT_STEP;

      if (renderedCardsCount >= boardCards.length) {
        removeExemplar(showMoreButton);
      }
    });
  }
}

function renderCard(container, card) {
  const cardComponent = new MovieCard(card);
  render(container, cardComponent);

  const renderPopup = () => {
    cardEditComponent.currentCard = card;
    render(body, cardEditComponent);
    body.classList.toggle(`hide-overflow`, true);
    document.addEventListener(`keydown`, onEscKeyDown);
    cardEditComponent.setClickHandler(deletePopup);
  };

  const deletePopup = () => {
    removeExemplar(cardEditComponent);
    body.classList.toggle(`hide-overflow`, false);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      deletePopup();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  cardComponent.setClickHandler(renderPopup);
}


