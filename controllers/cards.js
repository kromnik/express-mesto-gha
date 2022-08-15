const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (cards.length === 0) {
        res.status(404).send({ message: 'Карточеки не найдены' });
        return;
      }
      res.status(200).send(cards);
    })
    .catch((err) => {
      res.status(500).send({ message: `Ошибка на сервере: ${err}` });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(500).send({ message: `Ошибка на сервере: ${err}` });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
        return;
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      res.status(500).send({ message: `Ошибка на сервере: ${err}` });
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Передан несуществующий id карточки' });
        return;
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      res.status(500).send({ message: `Ошибка на сервере: ${err}` });
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Передан несуществующий id карточки' });
        return;
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      res.status(500).send({ message: `Ошибка на сервере: ${err}` });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
