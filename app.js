const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = { _id: '62f8e9d9d0f9cccc50c1f450' };
  next();
});

app.use('/', usersRoutes);
app.use('/', cardsRoutes);

app.listen(PORT);