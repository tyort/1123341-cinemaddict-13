// import dayjs from "dayjs";

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateDuration = () => {
  const duration = getRandomInteger(80, 150);
  const hours = Math.trunc(duration / 60) !== 0 ? `${Math.trunc(duration / 60)}h` : ``;
  const minutes = duration % 60 !== 0 ? `${duration % 60}m` : ``;

  return hours + ` ` + minutes;
};

const generateRating = () => {
  const integer = getRandomInteger(1, 10);
  const fractional = getRandomInteger(0, 9);

  return `${integer}.${fractional}`;
};

const generateTitle = () => {
  const titles = [
    `Made for each other`,
    `Popeye meets sinbad`,
    `Sagebrush trail`,
    `Santa claus conquers the martians`,
    `The dance of life`,
    `The great flamarion`,
    `The man with the golden arm`
  ];
  const randomIndex = getRandomInteger(0, titles.length - 1);
  return titles[randomIndex];
};

const generateGenre = () => {
  const genres = [
    `Musical`,
    `Western`,
    `Drama`,
    `Cartoon`,
    `Mystery`,
    `Comedy`,
    `Horror`
  ];
  const randomIndex = getRandomInteger(0, genres.length - 1);
  return genres[randomIndex];
};

const generateDescription = () => {
  const descriptions = [
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
  const sentences = new Set();
  for (let i = 0; i < getRandomInteger(1, 5); i++) {
    sentences.add(descriptions[getRandomInteger(0, descriptions.length - 1)]);
  }
  const description = sentences.size !== 0 ? `${[...sentences].join(`. `)}.` : ``;
  return description;
};

export const generateTask = () => {
  const title = generateTitle();

  return {
    poster: title.toLowerCase().replace(/\s+/g, `-`),
    title,
    rating: generateRating(),
    [`production year`]: getRandomInteger(1900, 2019),
    duration: generateDuration(),
    genre: generateGenre(),
    description: generateDescription(),
    [`number of comments`]: getRandomInteger(0, 5),
    [`watch plan`]: Boolean(getRandomInteger(0, 1)),
    hasWatched: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};

console.log(generateTask());


