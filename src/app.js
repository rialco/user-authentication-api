const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const helmet = require('helmet');

const usersRoutes = require('./routes/users');
const ErrorSerializer = require('./serializers/ErrorSerializer');
const ApiError = require('./serializers/utils/ApiError');

// Initialize dotenv configuration to accept environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
  credentials: true,
  origin: process.env.INCOMING_URL || '*',
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/users', usersRoutes);

app.use((req, res, next) => {
  res.status(404).json(new ErrorSerializer('Not found'));
});

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    const { statusCode, message } = err;
    res.status(statusCode).json(new ErrorSerializer(message));
    return;
  }
  console.log(err.message);
  res.status(500).json('something went wrong');
});

module.exports = () => app;
