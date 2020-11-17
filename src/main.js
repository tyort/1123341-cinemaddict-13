import {createUserRankTemplate} from "./view/user-rank.js";

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const body = document.querySelector(`body`);
const siteHeaderElement = body.querySelector(`.header`);

render(siteHeaderElement, createUserRankTemplate(), `beforeend`);
