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

/*  1. Create a simple Node.js RESTful API.  

The dataset can be either:

Hardcoded array of JavaScript objects (as we have done) 
You can use (open) APIs (though creating, deleting, updating might be impossible) 
Read the data from the JSON file (You don’t have to update the file). 
Create your own dataset - don’t use the same we used during the lessons. There have to be more properties (not just id, name & price) AND/OR the datatype of one property is different (for example, boolean, date, object or array).

2. Create one server-side rendered webpage. Using Handlebars list the resources to the page. Add an external CSS file and add some styling to the webpage. You can do this using the same project.



Notice! Follow the instructions. Use the techniques we used in the classes (for example Express). */