'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');

// Our Dependencies
const client = require('./modules/client.js');
const location = require('./modules/location.js');
const weather = require('./modules/weather.js');
const events = require('./modules/events.js');
const yelp = require('./modules/yelp.js');
const trails = require('./modules/trails.js');
const movies = require('./modules/movies.js');

// Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

// Route Definitions
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/events', eventsHandler);
app.get('/yelp', yelpHandler);
app.get('/trails', trailsHandler);
app.get('/movies', moviesHandler);

app.use('*', notFoundHandler);
app.use(errorHandler);


function locationHandler(request,response) {
  const city = request.query.data;
  location.getLocationData(city)
    .then(data => sendJson(data, response))
    .catch( (error) => errorHandler(error, request, response) );
}

function weatherHandler(request,response) {
  const location = request.query.data;
  weather(location)
    .then ( summaries => sendJson(summaries, response) )
    .catch( (error) => errorHandler(error, request, response) );
}

function eventsHandler(request,response) {
  const location = request.query.data.formatted_query;
  events(location)
    .then ( eventsList => sendJson(eventsList, response) )
    .catch( (error) => errorHandler(error, request, response) );
}

function yelpHandler(request,response) {
  const location = request.query.data.search_query;
  yelp(location)
    .then ( reviews => sendJson(reviews, response) )
    .catch( (error) => errorHandler(error, request, response) );
}

function trailsHandler(request,response) {
  const lat = request.query.data.latitude;
  const lon = request.query.data.longitude;
  trails(lat, lon)
    .then ( trailsList => sendJson(trailsList, response) )
    .catch( (error) => errorHandler(error, request, response) );
}

function moviesHandler(request,response) {
  const location = request.query.data.search_query;
  movies(location)
    .then ( trailsList => sendJson(trailsList, response) )
    .catch( (error) => errorHandler(error, request, response) );
}

function sendJson(data, response) {
  response.status(200).json(data);
}

function notFoundHandler(request,response) {
  response.status(404).send('huh?');
}

function errorHandler(error,request,response) {
  response.status(500).send(error);
}

function startServer() {
  app.listen(PORT, () => console.log(`Server up on ${PORT}`));
}

// Start Up the Server after the database is connected and cache is loaded
client.connect()
  .then( startServer )
  .catch( err => console.error(err) );
