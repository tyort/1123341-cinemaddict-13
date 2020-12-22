import {generateRecordDay} from "./utils/project-tools.js";

export const allComments = [
  {
    text: `Booooooooooring`,
    author: `John Doe`,
    emoji: `sleeping`,
    day: generateRecordDay()
  },
  {
    text: `Hello! Nice`,
    author: `Gelo Bortelli`,
    emoji: `smile`,
    day: generateRecordDay()
  },
  {
    text: `What's wrong with you? Guys!`,
    author: `Arturo Gutti`,
    emoji: `angry`,
    day: generateRecordDay()
  },
  {
    text: `Fuck it`,
    author: `Tyo Sergey`,
    emoji: `angry`,
    day: generateRecordDay()
  },
  {
    text: `Oh no! My eyes!!!!`,
    author: `Conor Gregor`,
    emoji: `puke`,
    day: generateRecordDay()
  }
];

export const ages = [`0+`, `6+`, `12+`, `16+`, `18+`];

export const allEmojies = [`angry`, `puke`, `sleeping`, `smile`];

export const moviesTitles = [
  `Made for each other.png`,
  `Popeye meets sinbad.png`,
  `Sagebrush trail.jpg`,
  `Santa claus conquers the martians.jpg`,
  `The dance of life.jpg`,
  `The great flamarion.jpg`,
  `The man with the golden arm.jpg`
];

export const genres = [
  `Musical`,
  `Western`,
  `Drama`,
  `Cartoon`,
  `Mystery`,
  `Comedy`,
  `Horror`
];

export const descriptions = [
  `In rutrum ac purus sit amet tempus`,
  `Nunc fermentum tortor ac porta dapibus`,
  `Aliquam erat volutpat`,
  `Sed sed nisi sed augue convallis suscipit in sed felis`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante`,
  `Aliquam id orci ut lectus varius viverra`,
  `Fusce tristique felis at fermentum pharetra`,
  `Cras aliquet varius magna, non porta ligula feugiat eget`,
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit`
];

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`,
};

export const UpdatePopup = {
  OTHER: `OTHER`,
  POPUP_AT_ALL: `POPUP_AT_ALL`,
};

export const UpdatedVersion = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
};

export const MenuItem = {
  CATALOG: `CATALOG`,
  STATISTICS: `STATISTICS`
};

export const TimePeriod = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};
