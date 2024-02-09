//packages
const createError = require('http-errors');
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const userRoutes = require("./routes/userRoutes")

//utilities
const connectDb = require('./config/init_mongo');

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;
connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.get('/', (req, res, next) => {
  res.send('Request reached and handled');
});


app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});
