const express = require("express");
const cors = require("cors");
const apiRoute = require("./api");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiRoute);

module.exports = app;