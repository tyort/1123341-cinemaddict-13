// Модуль, который будет отправлять на сервер REST-запросы
import CardsModel from "./model/cards.js";

const Method = {
  GET: `GET`,
  PUT: `PUT`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getMovies() {
    return this._load({url: `movies`})
      // получаем pending («ожидание»), в последствии одно из:
      // fulfilled («выполнено успешно») или rejected («выполнено с ошибкой»).
      .then(Api.toJSON)
      // не меняет результат метода getMovies()
      // но создает список карт удобоваримый для моей придуманной структуру
      .then((cards) => cards.map(CardsModel.adaptToClient));
  }

  getComments() {
    return this._load({url: `comments/11`})
      .then(Api.toJSON);
  }

  updateMovie(card) { // возвращает fetch
    return this._load({
      url: `movies/${card.id}`,
      method: Method.PUT,
      body: JSON.stringify(CardsModel.adaptToServer(card)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(CardsModel.adaptToClient);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(
        `${this._endPoint}/${url}`, // адрес с которого мы хоти получить данные

        // второй аргумент обязательно объект
        {
          method,
          body,
          headers
        }
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
