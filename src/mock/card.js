const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
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
  return {
    poster: ``,
    title: generateTitle(),
    rating: null,
    [`production year`]: getRandomInteger(1900, 2019),
    duration: undefined,
    genre: ``,
    isFavorite: false,
    description: generateDescription(),
    [`number of comments`]: getRandomInteger(0, 5)
  };
};


