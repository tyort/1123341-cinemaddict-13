import {render, removeExemplar} from "../utils/view-tools";
import NoMovies from "../view/no-movies";
import Sort from "../view/sorting.js";
import MoviesLists from "../view/movies-all.js";
import ShowMore from "../view/show-more.js";
import MovieCard from "../view/movie-card.js";
import MovieEdit from "./view/movie-edit.js";

const body = document.querySelector(`body`);
const siteMainElement = body.querySelector(`.main`);
const EXTRA_CARD_COUNT = 2;
const CARD_COUNT_STEP = 5;
const cardEditComponent = new MovieEdit();


export default class Board {
  constructor() {
    this._moviesListsComponent = new MoviesLists();
  }

  init(cards) {
    this._moviesCards = cards.slice();
    this._renderMain();
  }

  _renderSort() {
    render(siteMainElement, new Sort());
  }

  _renderCard(container, card) {
    const cardComponent = new MovieCard(card);

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
    render(container, cardComponent);
  }

  _renderCards(container, from, to) {
    this._moviesCards
      .slice(from, to)
      .forEach((card) => this._renderCard(container, card));
  }

  _renderNoMovies() {
    render(siteMainElement, new NoMovies());
  }

  _renderMain() {
    if (this._moviesCards.length === 0) {
      this._renderNoMovies();
      return;
    }

    this._renderSort();
    render(siteMainElement, this._moviesListsComponent);
    const filmsLists = this._moviesListsComponent.getElement().querySelectorAll(`.films-list`);

    filmsLists.forEach((list, index) => {
      const container = list.querySelector(`.films-list__container`);
      const count = index === 0 ? CARD_COUNT_STEP : EXTRA_CARD_COUNT;
      this._renderCards(container, 0, Math.min(this._moviesCards.length, count));
    });

    if (this._moviesCards.length > CARD_COUNT_STEP) {
      let renderedCardsCount = CARD_COUNT_STEP;

      const showMoreButton = new ShowMore();
      render(filmsLists[0], showMoreButton);

      showMoreButton.setClickHandler(() => {
        const container = filmsLists[0].querySelector(`.films-list__container`);
        this._renderCards(container, renderedCardsCount, renderedCardsCount + CARD_COUNT_STEP);
        renderedCardsCount += CARD_COUNT_STEP;

        if (renderedCardsCount >= this._moviesCards.length) {
          removeExemplar(showMoreButton);
        }
      });
    }
  }
}
