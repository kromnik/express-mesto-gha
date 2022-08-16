const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        res.status(404).send({ message: 'Пользователи не найдены' });
        return;
      }
      res.status(200).send(users);
    })
    .catch((err) => {
      res.status(500).send({ message: `Ошибка на сервере: ${err}` });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Пользователь по указанному id не найден' });
      } else if (err.statusCode === 404) {
        res.status(err.statusCode).send({ message: 'Пользователь по заданному id отсутствует в базе' });
      } else {
        res.status(500).send({ message: `Ошибка на сервере: ${err}` });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(500).send({ message: `Ошибка на сервере: ${err}` });
      }
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  const ownerId = req.user._id;
  User.findByIdAndUpdate(ownerId, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else if (err.statusCode === 404) {
        res.status(err.statusCode).send({ message: 'Пользователь по заданному id отсутствует в базе' });
      } else {
        res.status(500).send({ message: `Ошибка на сервере: ${err}` });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const ownerId = req.user._id;
  User.findByIdAndUpdate(ownerId, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else if (err.statusCode === 404) {
        res.status(err.statusCode).send({ message: 'Пользователь по заданному id отсутствует в базе' });
      } else {
        res.status(500).send({ message: `Ошибка на сервере: ${err}` });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
