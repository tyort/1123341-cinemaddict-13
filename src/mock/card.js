import {getRandomInteger} from "../utils/common-tools.js";
import {ages, moviesTitles, genres, descriptions} from "../const";

const generateRating = () => {
  const integer = getRandomInteger(1, 10);
  const fractional = getRandomInteger(0, 9);

  return `${integer}.${fractional}`;
};

const generateDuration = () => {
  const duration = getRandomInteger(80, 150);
  const hours = Math.trunc(duration / 60) !== 0 ? `${Math.trunc(duration / 60)}h` : ``;
  const minutes = duration % 60 !== 0 ? `${duration % 60}m` : ``;

  return hours + ` ` + minutes;
};

const generateAgeLimits = () => {
  const randomIndex = getRandomInteger(0, ages.length - 1);
  return ages[randomIndex];
};

const generateTitle = () => {
  const randomIndex = getRandomInteger(0, moviesTitles.length - 1);
  return moviesTitles[randomIndex];
};

const generateGenres = () => {
  const titles = new Set();
  for (let i = 0; i < getRandomInteger(1, 5); i++) {
    titles.add(genres[getRandomInteger(0, genres.length - 1)]);
  }

  return [...titles];
};

const generateDescription = () => {
  const sentences = new Set();
  for (let i = 0; i < getRandomInteger(1, 5); i++) {
    sentences.add(descriptions[getRandomInteger(0, descriptions.length - 1)]);
  }

  const description = sentences.size !== 0 ? `${[...sentences].join(`. `)}.` : ``;

  return description;
};

const generateDate = () => {
  const milliseconds = getRandomInteger(315522000000, 1577739600000);

  return new Date(milliseconds);
};

export const generateCard = () => {
  const title = generateTitle();

  return {
    poster: title.toLowerCase().replace(/\s+/g, `-`),
    title: title.slice(0, title.length - 4),
    rating: generateRating(),
    releaseDate: generateDate(),
    duration: generateDuration(),
    genres: generateGenres(),
    description: generateDescription(),
    commentsSum: getRandomInteger(0, 5),
    watchPlan: Boolean(getRandomInteger(0, 1)),
    hasWatched: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    ageLimit: generateAgeLimits()
  };
};

