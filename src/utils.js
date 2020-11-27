import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const generateRecordDay = () => {
  const daysAgo = getRandomInteger(0, 14);

  if (daysAgo <= 7 && !!daysAgo) {
    return dayjs().subtract(daysAgo, `day`).fromNow();
  }

  return daysAgo ? dayjs().subtract(daysAgo, `day`).format(`YYYY/MM/DD HH:mm`) : `today`;
};

export const RenderPosition = {
  AFTERBEGIN: `afterBegin`,
  BEFOREEND: `beforeEnd`,
  BEFOREBEGIN: `beforeBegin`,
  AFTEREND: `afterEnd`
};

export const render = (container, element, place) => {
  // в элемент уже записан готовый DOM-элемент, а не строковый шаблон
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREBEGIN:
      container.before(element);
      break;
    case RenderPosition.AFTEREND:
      container.after(element);
      break;
    default:
      container.append(element);
  }
};

export const renderTemplate = (container, template, place = RenderPosition.BEFOREEND) => {
  // template в качестве строки, а не DOM-элемента
  container.insertAdjacentHTML(place, template);
};

// Принцип работы прост:
// 1. создаём пустой div-блок
// 2. берём HTML в виде строки и вкладываем в этот div-блок, превращая в DOM-элемент
// 3. возвращаем этот DOM-элемент
export const createElement = (template) => {
  const newElement = document.createElement(`div`); // 1
  newElement.innerHTML = template; // 2

  return newElement.firstChild; // 3
};
// Единственный нюанс, что HTML в строке должен иметь общую обёртку,
// то есть быть чем-то вроде <nav><a>Link 1</a><a>Link 2</a></nav>,
// а не просто <a>Link 1</a><a>Link 2</a>

