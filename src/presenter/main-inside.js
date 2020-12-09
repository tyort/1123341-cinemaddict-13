import {render, removeExemplar} from "../utils/view-tools";
import {updateCard} from "../utils/project-tools";
import NoMovies from "../view/no-movies";
import Sort from "../view/sorting.js";
import MoviesLists from "../view/movies-all.js";
import ShowMore from "../view/show-more.js";
import MovieEdit from "../view/movie-edit.js";
import CardPresenter from "./movie-card";

const body = document.querySelector(`body`);
const siteMainElement = body.querySelector(`.main`);
const CARD_COUNT_STEP = 5;

export default class InnerMain {
  constructor() {
    this._cardEditComponent = new MovieEdit();
    this._sortComponent = new Sort();
    this._noMoviesComponent = new NoMovies();
    this._showMoreButtonComponent = new ShowMore();
    this._containerOfLists = new MoviesLists();
    this._listsComponents = [...this._containerOfLists.getElement().querySelectorAll(`.films-list`)];
    this._cardContainer = this._listsComponents[0].querySelector(`.films-list__container`);
    this._cardCountStep = CARD_COUNT_STEP;
    this._showMoreClickHandler = this._showMoreClickHandler.bind(this);
    this._cardsPresentersList = {};
    this._cardChangeAtAll = this._cardChangeAtAll.bind(this);
  }

  createTotally(cards) {
    this._moviesCards = cards.slice();
    this._renderInnerMain();
  }

  _cardChangeAtAll(updatedCard) {
    // возвращает обновленный массив карточек фильмов
    updateCard(this._moviesCards, updatedCard);
    // Ниже. Возвращаем презентер по id. Полностью создаем или перезаписываем карточку
    this._cardsPresentersList[updatedCard.id].createTotally(updatedCard);
  }

  _renderSort() {
    render(siteMainElement, this._sortComponent);
  }

  _renderMoviesLists() {
    render(siteMainElement, this._containerOfLists);
  }

  _renderCard(card) {
    const cardPresenter = new CardPresenter(this._cardContainer, this._cardChangeAtAll);
    cardPresenter.createTotally(card);
    this._cardsPresentersList[card.id] = cardPresenter; // получается объект {id: презентер, id: презентер}
  }

  _renderCards(from, to) {
    this._moviesCards
      .slice(from, to)
      .forEach((card) => this._renderCard(card));
  }

  // удаляем все экземпляры и представления карточек
  // удаляем экземпляр и представление кнопки
  // очищаем список всех презентеров карточек
  _clearInsideMain() {
    Object
      .values(this._cardsPresentersList)
      .forEach((presenter) => presenter.destroy());
    this._cardsPresentersList = {};
    this._cardCountStep = CARD_COUNT_STEP;
    removeExemplar(this._showMoreButtonComponent);
  }

  _renderNoMovies() {
    render(siteMainElement, this._noMoviesComponent);
  }

  _showMoreClickHandler() {
    this._renderCards(this._cardCountStep, this._cardCountStep + CARD_COUNT_STEP);
    this._cardCountStep += CARD_COUNT_STEP;

    if (this._cardCountStep >= this._moviesCards.length) {
      removeExemplar(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._listsComponents[0], this._showMoreButtonComponent);
    this._showMoreButtonComponent.setClickHandler(this._showMoreClickHandler);
  }

  _renderInnerMain() {
    if (this._moviesCards.length === 0) {
      this._renderNoMovies();
      return;
    }

    this._renderSort();
    this._renderMoviesLists();
    this._renderCards(0, Math.min(this._moviesCards.length, CARD_COUNT_STEP));

    if (this._moviesCards.length > CARD_COUNT_STEP) {
      this._renderShowMoreButton();
    }
  }
}
