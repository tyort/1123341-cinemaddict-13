import dayjs from "dayjs";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from "./abstract-smart.js";
import {generateOriginalGenres, generateCountCardsByGenre, generateWatchedCards} from "../utils/project-tools.js";

const renderGenresChart = (genresCtx, sortedCardsByCount) => {
  return new Chart(genresCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: [...sortedCardsByCount.keys()], // ключи new Map();
      datasets: [{
        data: [...sortedCardsByCount.values()], // значения new Map();
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 25
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 25
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 40
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatisticsTemplate = (cards, topGenre) => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const totalDuration = cards
    .map((card) => card.duration)
    .reduce(reducer, 0);

  const hours = parseInt(dayjs.duration(totalDuration, `minutes`).asHours(), 10);
  const minutes = dayjs.duration(totalDuration, `minutes`).minutes();

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Sci-Fighter</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${cards.length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class Statistics extends SmartView {
  constructor(cards) {
    super();
    this._cards = generateWatchedCards(cards.main);
    this._genres = generateOriginalGenres(this._cards);

    // создаем массив, где каждый элемент;
    // [жанр, количество просмотренных фильмов этого жанра];
    this._genresCapacity = this._genres.map((genre) => [genre, generateCountCardsByGenre(this._cards, genre)]);

    // сортируем массив, что выше и создаем из него new Map();
    this._sortedGenres = new Map(this._genresCapacity.sort((a, b) => b[1] - a[1]));

    this._setCharts();
  }

  removeElement() {
    super.removeElement();
    if (this._genresCart !== null) {
      this._genresCart = null;
    }
  }

  getTemplate() {
    const topGenre = [...this._sortedGenres][0][0];
    return createStatisticsTemplate(this._cards, topGenre);
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    if (this._genresCart !== null) {
      this._genresCart = null;
    }

    const genresCtx = this.getElement().querySelector(`.statistic__chart`);
    this._genresCart = renderGenresChart(genresCtx, this._sortedGenres);
  }
}
