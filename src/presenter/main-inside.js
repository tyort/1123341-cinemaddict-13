import {render, removeExemplar} from "../utils/view-tools";
import {compareDate, compareRating, compareCommentsCount} from "../utils/project-tools";
import {SortType, UpdatePopup, UpdatedVersion} from "../const.js";
import {filterCapacity} from "../utils/filter.js";
import NoMovies from "../view/no-movies";
import Sort from "../view/sorting.js";
import MoviesLists from "../view/movies-all.js";
import ShowMore from "../view/show-more.js";
import Loading from "../view/loading.js";
import CardPresenter from "./movie-card";
import CardEditPresenter from "./movie-edit";

const CARD_COUNT_STEP = 5;
const EXTRA_CARD_COUNT = 2;

export default class InnerMain {
  constructor(mainContainer, filterModel, cardsModel, api) {
    this._cardsModel = cardsModel;
    this._filterModel = filterModel;
    this._mainContainer = mainContainer;
    this._api = api;
    this._sortComponent = null;
    this._loadingComponent = new Loading();
    this._noMoviesComponent = new NoMovies();
    this._showMoreButtonComponent = null;
    this._containerOfLists = null;
    this._listsComponents = null;
    this._cardContainers = null;
    this._renderedCardsCount = CARD_COUNT_STEP;
    this._checkedSortType = SortType.DEFAULT;
    this._allPresenters = {mainList: {}, rateList: {}, commentsList: {}};
    this._handleShowMoreClick = this._handleShowMoreClick.bind(this);
    this._handleCardDataChange = this._handleCardDataChange.bind(this);
    this._handleSomeWhatRerender = this._handleSomeWhatRerender.bind(this);
    this._handleStartSorting = this._handleStartSorting.bind(this);
    this._isLoading = true;
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this._cardEditPresenter = new CardEditPresenter(this._handleCardDataChange);
  }

  show() {
    this._sortComponent.getElement().classList.toggle(`visually-hidden`, false);
    this._containerOfLists.getElement().classList.toggle(`visually-hidden`, false);
  }

  hide() {
    this._sortComponent.getElement().classList.toggle(`visually-hidden`, true);
    this._containerOfLists.getElement().classList.toggle(`visually-hidden`, true);
  }

  _getSortedCards() {
    // у экземпляра другого класса вызываем метод getCards()
    // тот в свою очередь возвращает _cards
    const filterType = this._filterModel.getFilter();
    const cards = this._cardsModel.getCards();
    // когда у объекта в свойство записана функция
    // то вызов выглядит так (см.ниже)
    const filtredCards = filterCapacity[filterType](cards);

    switch (this._checkedSortType) {
      case SortType.RATING:
        return filtredCards.slice().sort(compareRating);
      case SortType.DATE:
        return filtredCards.slice().sort(compareDate);
    }

    return filtredCards.slice();
  }

  _handleCardDataChange(updateType, updatedVersion, updatedCard) {
    // здесь только создаются массивы за счет например this._cardsModel.deleteComment;
    // т.е. массивы создаются только в cardsModel
    // и ссылку на _handleSomeWhatRerender (см. ниже) можно только получить там!
    switch (updateType) {
      case UpdatePopup.POPUP_AT_ALL:
        const usersForDelete = this._cardsModel.getComments()
          .slice()
          .filter((oldUser) => !updatedCard.allComments
            .some((actualUser) => actualUser.id === oldUser.id));

        const usersForAdd = updatedCard.allComments
          .slice()
          .filter((actualUser) => !this._cardsModel.getComments()
            .some((oldUser) => oldUser.id === actualUser.id));

        if (usersForAdd.length > 0) {
          usersForAdd.forEach((user) => {
            this._api.addComment(updatedCard, user)
            .then(() => this._api.updateMovie(updatedCard))
            .then((response) => this._cardsModel.changePopup(updatedVersion, response));
          });
        }

        if (usersForDelete.length > 0) {
          usersForDelete.forEach((user) => {
            this._api.deleteComment(user)
              .then(() => this._api.updateMovie(updatedCard))
              .then((response) => this._cardsModel.changePopup(updatedVersion, response));
          });
        }

        if (usersForDelete.length === 0 && usersForAdd.length === 0) {
          this._api.updateMovie(updatedCard)
            .then((response) => this._cardsModel.changePopup(updatedVersion, response));
        }

        break;
      case UpdatePopup.OPEN_POPUP:
        this._api.getComments(updatedCard)
          .then((comments) => {
            this._cardsModel.setComments(comments, updatedCard);
            this._cardsModel.openPopup(updatedVersion, updatedCard);
          });
        break;
    }
  }

  _handleSomeWhatRerender(updateType, updatedCard) {
    // Создаем или перезаписываем карточку или весь список
    // Короче занимаемся перерисовкой
    switch (updateType) {
      case UpdatedVersion.PATCH:
        this._cardEditPresenter.createTotally(updatedCard);
        break;
      case UpdatedVersion.MINOR:
        // не меняем количество уже показанных карточек
        // не меняем тип сортировки
        Object.keys(this._allPresenters).forEach((list) => {
          if (this._allPresenters[list][updatedCard.id]) {
            this._allPresenters[list][updatedCard.id].createTotally(updatedCard);
          }
        });
        break;
      case UpdatedVersion.MAJOR:
        // начинаем показ опять с минимального количества карточек
        // ставим сортировку на дефолт
        this.clearInsideMain({resetRenderedCardsCount: true, resetSortType: true});
        this.renderInnerMain();
        break;
      case UpdatedVersion.INIT:
        this._isLoading = false;
        removeExemplar(this._loadingComponent);
        this.renderInnerMain();
        break;
    }
  }

  // Кнопка уже нарисована. Но можно на нее еще жать
  // с помощью этого хэндлера
  _handleShowMoreClick() {
    const cardsCount = this._getSortedCards().length;
    const newRenderedCardsCount = Math.min(cardsCount, this._renderedCardsCount + CARD_COUNT_STEP);
    const cards = this._getSortedCards().slice(this._renderedCardsCount, newRenderedCardsCount);

    this._renderCards(cards, this._cardContainers[0]);
    this._renderedCardsCount = newRenderedCardsCount;

    if (this._renderedCardsCount >= cardsCount) {
      removeExemplar(this._showMoreButtonComponent);
    }
  }

  _handleStartSorting(sortType) {
    if (this._checkedSortType === sortType) {
      return;
    }

    this._checkedSortType = sortType;
    this.clearInsideMain({resetRenderedCardsCount: true});
    this.renderInnerMain();
  }

  clearInsideMain({resetRenderedCardsCount = false, resetSortType = false}) {
    const mainCardsCount = this._getSortedCards().length;

    Object.keys(this._allPresenters).forEach((list) => {
      Object.values(this._allPresenters[list])
        .forEach((cardPresenter) => cardPresenter.destroy());
    });

    this._allPresenters = {
      mainList: {},
      rateList: {},
      commentsList: {}
    };

    removeExemplar(this._loadingComponent);
    removeExemplar(this._noMoviesComponent);
    removeExemplar(this._sortComponent);
    removeExemplar(this._containerOfLists);
    removeExemplar(this._showMoreButtonComponent);

    if (resetRenderedCardsCount) {
      this._renderedCardsCount = CARD_COUNT_STEP;

    } else {
      this._renderedCardsCount = Math.min(mainCardsCount, this._renderedCardsCount);
    }

    if (resetSortType) {
      this._checkedSortType = SortType.DEFAULT;
    }

    this._cardsModel.removeObserver(this._handleSomeWhatRerender);
    this._filterModel.removeObserver(this._handleSomeWhatRerender);
  }

  renderInnerMain() {
    this._cardsModel.addObserver(this._handleSomeWhatRerender);
    this._filterModel.addObserver(this._handleSomeWhatRerender);

    if (this._isLoading) {
      render(this._mainContainer, this._loadingComponent);
      return;
    }

    if (this._getSortedCards().length === 0) {
      render(this._mainContainer, this._noMoviesComponent);
      return;
    }

    this._renderSort();
    this._renderContainerOfList();

    const сardsCount = this._getSortedCards().length;

    const mainCards = this._getSortedCards()
      .slice(0, Math.min(сardsCount, this._renderedCardsCount));

    const ratedCards = this._getSortedCards()
      .sort(compareRating)
      .slice(0, Math.min(сardsCount, EXTRA_CARD_COUNT));

    const commentedCards = this._getSortedCards()
      .sort(compareCommentsCount)
      .slice(0, Math.min(сardsCount, EXTRA_CARD_COUNT));

    this._renderCards(mainCards, this._cardContainers[0]);
    this._renderCards(ratedCards, this._cardContainers[1]);
    this._renderCards(commentedCards, this._cardContainers[2]);

    if (this._getSortedCards().length > this._renderedCardsCount) {
      this._renderShowMoreButton();
    }
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new Sort(this._checkedSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleStartSorting);
    render(this._mainContainer, this._sortComponent);
  }

  _renderContainerOfList() {
    this._containerOfLists = new MoviesLists();
    this._listsComponents = [...this._containerOfLists.getElement().querySelectorAll(`.films-list`)];
    this._cardContainers = this._listsComponents.map((list) => list.querySelector(`.films-list__container`));
    render(this._mainContainer, this._containerOfLists);
  }

  _renderCard(container, card) {
    const cardPresenter = new CardPresenter(container, this._handleCardDataChange);
    cardPresenter.createTotally(card);
    switch (container) {
      case this._cardContainers[2]:
        this._allPresenters.commentsList[card.id] = cardPresenter;
        break;
      case this._cardContainers[1]:
        this._allPresenters.rateList[card.id] = cardPresenter;
        break;
      default:
        this._allPresenters.mainList[card.id] = cardPresenter;
    }
  }

  _renderCards(cards, container) {
    cards.forEach((card) => this._renderCard(container, card));
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMore();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreClick);
    render(this._listsComponents[0], this._showMoreButtonComponent);
  }
}
