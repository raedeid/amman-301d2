'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const pg = require('pg');
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');

// Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

// Route Definitions
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.use('*', notFoundHandler);
app.use(errorHandler);

/*
  START

  function locationHandler(request,response) {

    const city = request.query.data;

    let SQL = 'SELECT * FROM locations WHERE search_query = $1';
    let values = [city];

    client.query(SQL, values)
      .then( results => {
        if ( results.rowCount ) {
          response.status(200).json(results.rows[0]);
        }
        else {
          let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.GEOCODE_API_KEY}`;

          fetchRemoteData(url, Location)
            .then((newLocation) => saveLocation(city, newLocation) )
            .then( savedLocation => response.status(200).json(savedLocation) )
            .catch(error => showError(error, response));

        }
      });
  }
 */


// REFACTOR: Location Handler, calls helper functions now
function locationHandler(request,response) {
  const city = request.query.data;
  getLocationData(city)
    .then(data => render(data, response))
    .catch( (error) => errorHandler(error, request, response) );
}

function getLocationData(city) {

  let SQL = 'SELECT * FROM locations WHERE search_query = $1';
  let values = [city];

  return client.query(SQL, values)
    .then( results => {
      if (results.rowCount) { return results.rows[0]; }
      else {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.GEOCODE_API_KEY}`;
        return superagent.get(url)
          .then(data => cacheLocation(city, data.body));
      }
    });
}

function cacheLocation( city, data ) {
  const location = new Location(data.results[0]);
  let SQL = `
    INSERT INTO locations (search_query, formatted_query, latitude, longitude) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *
  `;
  let values = [city, location.formatted_query, location.latitude, location.longitude];
  return client.query(SQL, values)
    .then( results => results.rows[0] );
}

function Location(data) {
  this.formatted_query = data.formatted_address;
  this.latitude = data.geometry.location.lat;
  this.longitude = data.geometry.location.lng;
}

// http://localhost:3000/weather?data%5Blatitude%5D=47.6062095&data%5Blongitude%5D=-122.3320708
// REFACTOR:
//  What are our pain points here?
//  Where can we extract logic for this (and any other "normal" API")
function weatherHandler(request,response) {

  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;

  superagent.get(url)
    .then( data => {
      const weatherSummaries = data.body.daily.data.map(day => {
        return new Weather(day);
      });
      response.status(200).json(weatherSummaries);
    })
    .catch( (error) => {
      errorHandler(error, request, response);
    });

}

function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}

function render(data, response) {
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
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));
client.connect()
  .then( startServer )
  .catch( err => console.error(err) );
