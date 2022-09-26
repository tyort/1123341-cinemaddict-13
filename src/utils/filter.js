import {FilterType} from "../const";

export const filterCapacity = {
  [FilterType.ALL]: (cards) => cards,
  [FilterType.WATCHLIST]: (cards) => cards.filter((card) => card.watchPlan),
  [FilterType.HISTORY]: (cards) => cards.filter((card) => card.hasWatched),
  [FilterType.FAVORITES]: (cards) => cards.filter((card) => card.isFavorite),
};

