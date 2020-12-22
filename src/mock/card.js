import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {nanoid} from "nanoid";
import {getRandomInteger} from "../utils/common-tools.js";
import {generateDate} from "../utils/project-tools.js";
import {ages, moviesTitles, genres, descriptions, allComments} from "../const";
dayjs.extend(relativeTime);


const currentDate = new Date();
const parsedCurrentDate = dayjs(currentDate);

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

  return Number(`${integer}.${fractional}`);
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

const actors = [
  `Buratino`,
  `Patrick`,
  `Roberto Suka`,
  `Berkova`,
  `Shalava`,
  `Durka`,
  `Jopka Popka`
];

const countries = [
  `Anal`,
  `Pizda`,
  `Russia`,
  `USA`,
  `India`,
  `Canada`,
];

const generateActors = () => {
  const names = new Set();
  for (let i = 0; i < getRandomInteger(1, 5); i++) {
    names.add(actors[getRandomInteger(0, actors.length - 1)]);
  }

  return [...names];
};

const generateDirector = () => {
  return actors[getRandomInteger(0, actors.length - 1)];
};

const generateCountry = () => {
  return countries[getRandomInteger(0, countries.length - 1)];
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
  const hasWatched = Boolean(getRandomInteger(0, 1));
  const dateOfView = hasWatched
    ? parsedCurrentDate.subtract(getRandomInteger(0, 400), `day`)
    : null;

  const posterName = title.toLowerCase().replace(/\s+/g, `-`);
  const poster = `images/posters/${posterName}`;

  return {
    id: nanoid(5),
    poster,
    title: title.slice(0, title.length - 4),
    rating: generateRating(),
    releaseDate: generateDate(),
    releaseCountry: generateCountry(),
    duration: getRandomInteger(80, 150),
    genres: generateGenres(),
    actors: generateActors(),
    writers: generateActors(),
    director: generateDirector(),
    description: generateDescription(),
    watchPlan: Boolean(getRandomInteger(0, 1)),
    hasWatched,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    ageLimit: generateAgeLimits(),
    allComments: generateComments(),
    dateOfView
  };
};

