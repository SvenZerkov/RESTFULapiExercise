const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();

// default settings
app.engine("handlebars", exphbs.engine({
    defaultLayout: "main"
  }))
  
  app.set("view engine", "handlebars");
  
  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: false }));

  