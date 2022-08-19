const User = require('../models/user');

const ERROR_BADREQUEST = 400;
const ERROR_NOTFOUND = 404;
const ERROR_INTERNALSERVERERROR = 500;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(ERROR_INTERNALSERVERERROR).send({ message: `Ошибка на сервере: ${err}` });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error();
      error.statusCode = ERROR_NOTFOUND;
      throw error;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BADREQUEST).send({ message: 'Передан некорректный id' });
      } else if (err.statusCode === ERROR_NOTFOUND) {
        res.status(err.statusCode).send({ message: 'Пользователь по заданному id отсутствует в базе' });
      } else {
        res.status(ERROR_INTERNALSERVERERROR).send({ message: `Ошибка на сервере: ${err}` });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BADREQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(ERROR_INTERNALSERVERERROR).send({ message: `Ошибка на сервере: ${err}` });
      }
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  const ownerId = req.user._id;
  User.findByIdAndUpdate(ownerId, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error();
      error.statusCode = ERROR_NOTFOUND;
      throw error;
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BADREQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else if (err.statusCode === ERROR_NOTFOUND) {
        res.status(err.statusCode).send({ message: 'Пользователь по заданному id отсутствует в базе' });
      } else {
        res.status(ERROR_INTERNALSERVERERROR).send({ message: `Ошибка на сервере: ${err}` });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const ownerId = req.user._id;
  User.findByIdAndUpdate(ownerId, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error();
      error.statusCode = ERROR_NOTFOUND;
      throw error;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BADREQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else if (err.statusCode === ERROR_NOTFOUND) {
        res.status(err.statusCode).send({ message: 'Пользователь по заданному id отсутствует в базе' });
      } else {
        res.status(ERROR_INTERNALSERVERERROR).send({ message: `Ошибка на сервере: ${err}` });
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
