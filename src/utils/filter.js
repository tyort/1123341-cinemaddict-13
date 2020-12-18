import {FilterType} from "../const";

export const filter = {
  [FilterType.ALL]: (cards) => cards.length,
  [FilterType.WATCHLIST]: (cards) => cards.filter((card) => card.watchPlan).length,
  [FilterType.HISTORY]: (cards) => cards.filter((card) => card.hasWatched).length,
  [FilterType.FAVORITES]: (cards) => cards.filter((card) => card.isFavorite).length,
};

