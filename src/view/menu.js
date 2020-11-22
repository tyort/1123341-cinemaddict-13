const createFilterItemTemplate = (filter) => {
  const {name, count} = filter;
  const filterName = name !== `all`
    ? `${name.slice(0, 1).toUpperCase()}${name.slice(1)}`
    : `All movies`;

  return `<a href="#${name}" class="main-navigation__item">
      ${filterName} <span class="main-navigation__item-count">${count}</span>
    </a>`;
};

export const createMenuTemplate = (filters) => {
  const filterItems = filters
    .map((filter) => createFilterItemTemplate(filter))
    .join(``);

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItems}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};
