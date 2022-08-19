const Card = require('../models/card');

const ERROR_BADREQUEST = 400;
const ERROR_NOTFOUND = 404;
const ERROR_INTERNALSERVERERROR = 500;

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      res.status(ERROR_INTERNALSERVERERROR).send({ message: `Ошибка на сервере: ${err}` });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BADREQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(ERROR_INTERNALSERVERERROR).send({ message: `Ошибка на сервере: ${err}` });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      const error = new Error();
      error.statusCode = ERROR_NOTFOUND;
      throw error;
    })
    .then((card) => {
      res.send({ message: `Карточка c id ${card.id} успешно удалена` });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BADREQUEST).send({ message: 'Передан некорректный id' });
      } else if (err.statusCode === ERROR_NOTFOUND) {
        res.status(err.statusCode).send({ message: 'Карточка по заданному id отсутствует в базе' });
      } else {
        res.status(ERROR_INTERNALSERVERERROR).send({ message: `Ошибка на сервере: ${err}` });
      }
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error();
      error.statusCode = ERROR_NOTFOUND;
      throw error;
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BADREQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else if (err.statusCode === ERROR_NOTFOUND) {
        res.status(err.statusCode).send({ message: 'Передан несуществующий id карточки' });
      } else {
        res.status(ERROR_INTERNALSERVERERROR).send({ message: `Ошибка на сервере: ${err}` });
      }
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error();
      error.statusCode = ERROR_NOTFOUND;
      throw error;
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BADREQUEST).send({ message: 'Переданы некорректные данные для снятия лайка' });
      } else if (err.statusCode === ERROR_NOTFOUND) {
        res.status(err.statusCode).send({ message: 'Передан несуществующий id карточки' });
      } else {
        res.status(ERROR_INTERNALSERVERERROR).send({ message: `Ошибка на сервере: ${err}` });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
