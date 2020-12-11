import {getRandomInteger} from "./common-tools.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);


export const generateRecordDay = () => {
  const daysAgo = getRandomInteger(0, 14);

  if (daysAgo <= 7 && !!daysAgo) {
    return dayjs().subtract(daysAgo, `day`).fromNow();
  }

  return daysAgo ? dayjs().subtract(daysAgo, `day`).format(`YYYY/MM/DD HH:mm`) : `today`;
};

export const updateCard = (cards, updatedCard) => {
  const index = cards.findIndex((card) => card.id === updatedCard.id);
  return index === -1 ? cards : [...cards.slice(0, index), updatedCard, ...cards.slice(index + 1)];
};

// numbers.sort(function (a, b) { // функция сформирует массив от большего к меньшему значению
//   return b - a;
// });

export const compareDate = (cardA, cardB) => {
  const dateA = dayjs(cardA.releaseDate);
  const dateB = dayjs(cardB.releaseDate);
  return dateB.diff(dateA, `day`);
};

export const compareRating = (cardA, cardB) => {
  return Number(cardB.rating) - Number(cardA.rating);
};

export const compareCommentsCount = (cardA, cardB) => {
  return Number(cardB.commentsSum) - Number(cardA.commentsSum);
};

