import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from "./abstract-smart.js";
import {TimePeriod} from "../const.js";
import {generateOriginalGenres, generateCountCardsByGenre, generateWatchedCards} from "../utils/project-tools.js";
dayjs.extend(duration);

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

const createStatisticsTemplate = (cards, topGenre, currentTimePeriod) => {
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

      <input ${currentTimePeriod === TimePeriod.ALL_TIME ? `checked` : ``} type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time">
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input ${currentTimePeriod === TimePeriod.TODAY ? `checked` : ``} type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input ${currentTimePeriod === TimePeriod.WEEK ? `checked` : ``} type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input ${currentTimePeriod === TimePeriod.MONTH ? `checked` : ``} type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input ${currentTimePeriod === TimePeriod.YEAR ? `checked` : ``} type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
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
    this._currentTimePeriod = TimePeriod.ALL_TIME;
    this._parsedCurrentDate = dayjs(new Date());
    this._cards = generateWatchedCards(cards.main);
    this._genres = generateOriginalGenres(this._cards);

    // создаем массив, где каждый элемент;
    // [жанр, количество просмотренных фильмов этого жанра];
    this._genresCapacity = this._genres.map((genre) => [genre, generateCountCardsByGenre(this._cards, genre)]);

    // сортируем массив, что выше и создаем из него new Map();
    this._sortedGenres = new Map(this._genresCapacity.sort((a, b) => b[1] - a[1]));
    this._topGenre = [...this._sortedGenres][0][0];

    this._formChangehandler = this._formChangehandler.bind(this);
    this._setCharts();
    this._changeViewPeriod();
  }

  removeElement() {
    super.removeElement();
    if (this._genresCart !== null) {
      this._genresCart = null;
    }
  }

  getTemplate() {
    return createStatisticsTemplate(this._cards, this._topGenre, this._currentTimePeriod);
  }

  restoreHandlers() {
    this._setCharts();
    this._changeViewPeriod();
  }

  _formChangehandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName === `INPUT`) {
      // const form = this.getElement().querySelector(`form`);
      // const checkedPeriod = form.querySelector(`[value=${evt.target.value}]`);
      this._currentTimePeriod = evt.target.value;
      this.updateElement();
    }
  }

  _changeViewPeriod() {
    this.getElement().querySelector(`form`)
      .addEventListener(`change`, this._formChangehandler);
  }

  _setCharts() {
    if (this._genresCart !== null) {
      this._genresCart = null;
    }

    const genresCtx = this.getElement().querySelector(`.statistic__chart`);
    this._genresCart = renderGenresChart(genresCtx, this._sortedGenres);
  }
}

// cards.forEach((card) => parsedCurrentDate.diff(card.dateOfView, `day`));
// const fkfller = dayjs.duration(7, `days`).days();
// const fkflle = dayjs.duration(7, `days`).weeks();
// const fkfll = dayjs.duration(30, `days`).months();
// const fkfl = dayjs.duration(365, `days`).years();
// console.log(fkfller);
// console.log(fkflle);
// console.log(fkfll);
// console.log(fkfl);
