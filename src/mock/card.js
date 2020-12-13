import {nanoid} from "nanoid";
import {getRandomInteger} from "../utils/common-tools.js";
import {generateDuration, generateDate} from "../utils/project-tools.js";
import {ages, moviesTitles, genres, descriptions, allComments} from "../const";

const generateComments = () => {
  return new Array(getRandomInteger(0, allComments.length - 1))
    .fill()
    .map((it, index) => {
      return allComments[index];
    });
};

const generateRating = () => {
  const integer = getRandomInteger(1, 10);
  const fractional = getRandomInteger(0, 9);

  return `${integer}.${fractional}`;
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

export const generateCard = () => {
  const title = generateTitle();

  return {
    id: nanoid(5),
    poster: title.toLowerCase().replace(/\s+/g, `-`),
    title: title.slice(0, title.length - 4),
    rating: generateRating(),
    releaseDate: generateDate(),
    duration: generateDuration(), // это файл dayjs
    genres: generateGenres(),
    description: generateDescription(),
    watchPlan: Boolean(getRandomInteger(0, 1)),
    hasWatched: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    ageLimit: generateAgeLimits(),
    allComments: generateComments(),
  };
};

