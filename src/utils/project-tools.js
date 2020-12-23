import {getRandomInteger} from "./common-tools.js";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import objectSupport from "dayjs/plugin/objectSupport";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(objectSupport);

export const generateDuration = (asMinutes) => {
  const minutes = dayjs.duration(asMinutes, `minutes`).minutes();
  const hours = dayjs.duration(asMinutes, `minutes`).hours();
  return dayjs({hour: hours, minute: minutes}).format(`H[h] mm[m]`);
};

export const generateDate = () => {
  const milliseconds = getRandomInteger(315522000000, 1577739600000);
  return new Date(milliseconds);
};

export const generateRecordDay = (recordDay) => {
  const currentDate = dayjs(new Date());
  const parsedRecordDay = dayjs(recordDay);
  const daysAgo = currentDate.diff(parsedRecordDay, `day`);

  if (daysAgo <= 7 && !!daysAgo) {
    return dayjs().subtract(daysAgo, `day`).fromNow();
  }

  return daysAgo ? dayjs().subtract(daysAgo, `day`).format(`YYYY/MM/DD HH:mm`) : `today`;
};

export const compareDate = (cardA, cardB) => {
  const dateA = dayjs(cardA.releaseDate);
  const dateB = dayjs(cardB.releaseDate);
  return dateB.diff(dateA, `day`);
};

export const compareRating = (cardA, cardB) => {
  return Number(cardB.rating) - Number(cardA.rating);
};

export const compareCommentsCount = (cardA, cardB) => {
  return Number(cardB.allComments.length) - Number(cardA.allComments.length);
};

export const generateOriginalGenres = (cards) => {
  const originalGenres = new Set();
  cards.forEach((card) => card.genres.forEach((genre) => originalGenres.add(genre)));
  return [...originalGenres];
};

export const generateCountCardsByGenre = (cards, genre) => {
  const isGenreAppear = (cardGenre) => cardGenre === genre;
  return cards.filter((card) => card.genres.some(isGenreAppear)).length;
};

export const generateWatchedCards = (cards) => {
  return cards.filter((card) => card.hasWatched);
};


