// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const isOnline = () => {
  return window.navigator.onLine;
};

const SHOW_TIME = 5000;

const toastContainer = document.createElement(`div`);
toastContainer.classList.add(`toast-container`);
document.body.append(toastContainer);

export const toast = (message) => {
  const toastItem = document.createElement(`div`);
  toastItem.textContent = message;
  toastItem.classList.add(`toast-item`);

  toastContainer.append(toastItem);

  setTimeout(() => {
    toastItem.remove();
  }, SHOW_TIME);
};
