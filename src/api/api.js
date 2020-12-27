// Модуль, который будет отправлять на сервер REST-запросы
import CardsModel from "../model/cards.js";

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  DELETE: `DELETE`,
  POST: `POST`
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

  getComments(card) {
    return this._load({url: `comments/${card.id}`})
      .then(Api.toJSON);
  }

  deleteComment(user) {
    return this._load({
      url: `comments/${user.id}`,
      method: Method.DELETE
    });
  }

  addComment(card, user) {
    return this._load({
      url: `comments/${card.id}`,
      method: Method.POST,
      body: JSON.stringify(user),
      headers: new Headers({"Content-Type": `application/json`})
    });
  }

  updateMovie(card) { // возвращает fetch
    return this._load({
      url: `movies/${card.id}`,
      method: Method.PUT,
      body: JSON.stringify(CardsModel.adaptToServer(card)), // !!!! выдает актуальные данные, только на сервер не записываются
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(CardsModel.adaptToClient);
  }

  // поможет в режиме offline загрузить изменения в LocalStorage
  // а когда появится сеть поможет передать информацию на сервер
  sync(data) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON);
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
