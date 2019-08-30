const mongoose = require("mongoose");
const express = require('express');
const app = express();
const { MONGO_URL } = require('./database');
const bodyParser = require("body-parser");
const passport = require("passport");

const routes = require('../routes');
const jwtauth = require('./passport');

app.use(passport.initialize()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

jwtauth(passport);

mongoose.connect(MONGO_URL, { useNewUrlParser: true })
    .then(() => console.log("MongoDB connected"))
    .catch(console.error);

module.exports = app;