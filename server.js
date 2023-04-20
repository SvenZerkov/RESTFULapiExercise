const express = require("express");
const exphbs = require("express-handlebars");
const dotenv = require("dotenv").config();
const path = require("path");
const fs = require("fs");


const app = express();

// default settings
app.engine("handlebars", exphbs.engine({
  defaultLayout: "main"
}))

app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/*  1. Create a simple Node.js RESTful API.  

The dataset can be either:

Hardcoded array of JavaScript objects (as we have done) 
You can use (open) APIs (though creating, deleting, updating might be impossible) 
Read the data from the JSON file (You don’t have to update the file). 
Create your own dataset - don’t use the same we used during the lessons. There have to be more properties (not just id, name & price) 
AND/OR the datatype of one property is different (for example, boolean, date, object or array).

2. Create one server-side rendered webpage. Using Handlebars list the resources to the page. Add an external CSS file and add some styling 
to the webpage. You can do this using the same project.



Notice! Follow the instructions. Use the techniques we used in the classes (for example Express). */

/* 
- create data on separate JSON file -> done
- create route for 
  - get one by id -> done
  - get all -> done
  - create new -> done
  - update -> patch put done
  - delete 

- create one server side rendered (SSR) web page => must use handlebars -> done
- render the content on that page -> done
- add css file -> done
  modify the page to be more accessible -> done, can continue

  EXTRA
  - add pictures
  - add find actions on site
    - needs routes for different searches
  
  */

// create planets variable and fill it with data from file
let planets = [];

fs.access("data/planets.json", fs.constants.F_OK, (err) => {
  if (err) {
    console.error(`Failed to access file: ${err}`);
    return;
  }

  fs.readFile("data/planets.json", (err, data) => {
    if (err) {
      console.error(`Failed to read file: ${err}`);
      return;
    }

    try {
      planets = JSON.parse(data);

    } catch (e) {
      console.error(`Failed to parse JSON data: ${e}`);
    }

    console.log(`Loaded ${planets.length} planets from file`);
  });
});

// log request to file
const logToFile = (req, res, next) => {
  // create log entry
  const logEntry = `Time: ${new Date().toISOString()}\n` +
    `Method: ${req.method}\n` +
    `URL: ${req.originalUrl}\n` +
    `Request body: ${JSON.stringify(req.body)}\n\n`;

  // write log entry to file
  const logFilePath = path.join(__dirname, 'requests.log');
  fs.appendFile(logFilePath, logEntry, err => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });

  // pass control to next middleware
  next();
}

module.exports = logToFile;

// log to file
app.use(logToFile);

// get all, res JSON
app.get("/api/planets", (req, res) => {
  res.contentType("application/json");
  res.json(planets);
});

// route get all to render
app.get("/planets", (req, res) => {
  // res.send("test");
  if (planets.length === 0) {
    res.status(500).send("Failed to load data");
    return;
  }

  res.render('planets',
    {
      title: 'Planets | Virsta Ranch ltd',
      pagetitle: 'Planets',
      planets: planets,
      desc: 'Info about planets'
    });

});

// route get one, res JSON
app.get("/api/planets/:id", (req, res) => {
  const id = Number(req.params.id);

  const planet = planets.find(planet => planet.id === id);

  if (planet) {
    res.json(planet);
  } else {

    res.status(404).json({
      msg: `Not found by id ${id}`
    })
  }

});

// route create one (must have name & type)
app.post("/api/planets", (req, res) => {
  // console.log(req.body);
  if (!req.body.name || !req.body.type) {
    res.status(400).json(
      {
        msg: "Resource name or type of the planet not sent"
      }
    )
  } else {
    let newID = planets[planets.length - 1].id + 1;

    const newPlanet = {
      id: newID,
      name: req.body.name,
      type: req.body.type,
      distance_from_sun_km: req.body.distance_from_sun_km,
      diameter_km: req.body.diameter_km,
      number_of_moons: req.body.number_of_moons
    }

    planets.push(newPlanet);

    const location = `${req.protocol}://${req.hostname}${req.path}/${newID}`
    res
      .status(201)
      .location(location)
      .json(newPlanet);
  }
});

// Update with patch using id
app.patch("/api/planets/:id", (req, res) => {
  //console.log(req.body);

  const idToUpdate = Number(req.params.id);

  if (!req.body.name || !req.body.type) {
    res.status(400).json(
      {
        msg: "Resource name or Type not sent"
      }
    )
  } else {
    let updatePlanet;

    planets.forEach((planet) => {
      if (planet.id === idToUpdate) {
        planet.name = req.body.name || planet.name;
        planet.type = req.body.type || planet.type;
        planet.distance_from_sun_km =
          req.body.distance_from_sun_km || planet.distance_from_sun_km;
        planet.diameter_km = req.body.diameter_km || planet.diameter_km;
        planet.number_of_moons =
          req.body.number_of_moons || planet.number_of_moons;

        updatePlanet = planet;
      }
    });

    if (!updatePlanet) {
      res.status(404).json({
        msg: "Planet not found"
      });
    } else {
      const location = `${req.protocol}://${req.hostname}${req.path}/${idToUpdate}`;
      res.status(200).location(location).json(updatePlanet);
    }
  }
});

// Update with put
app.put("/api/planets/:id", (req, res) => {
  console.log(req.body);
  const idToUpdate = Number(req.params.id);

  const planetIndex = planets.findIndex(planet => planet.id === idToUpdate);
  if (planetIndex !== -1) {
    const updatedPlanet = {
      id: idToUpdate,
      name: req.body.name || planets[planetIndex].name,
      type: req.body.type || planets[planetIndex].type,
      distance_from_sun_km: req.body.distance_from_sun_km || planets[planetIndex].distance_from_sun_km,
      diameter_km: req.body.diameter_km || planets[planetIndex].diameter_km,
      number_of_moons: req.body.number_of_moons || planets[planetIndex].number_of_moons
    };

    planets.splice(planetIndex, 1, updatedPlanet);

    const location = `${req.protocol}://${req.hostname}${req.path}/${idToUpdate}`
    res
      .status(200)
      .location(location)
      .json(updatedPlanet);

  } else {
    res.status(404).json({
      msg: "Planet not found"
    });
  }
});

// Delete planet
app.delete("/api/planets/:id", (req, res) => {
  const id = Number(req.params.id);

  const planetIndex = planets.findIndex(planet => planet.id === id);
  if (planetIndex !== -1) {
    planets.splice(planetIndex, 1);
    res.json(planets);
  } else {
    res.status(404).json({
      msg: "Planet not found"
    });
  }
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));